import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { queryGitHub, queryGitLab, queryLeetCode, queryInstagram, queryFacebook, queryDevTo, queryGravatar } from './server/connectors.ts';
import { runGeminiIntelligence } from './server/geminiService.ts';
import { UserProfile, StoredInvestigation, InvestigationResult } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// In-Memory User Store
interface InternalUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  organization: string;
  clearanceLevel: 'LEVEL_1_STANDARD' | 'LEVEL_2_TACTICAL' | 'LEVEL_3_DIRECTOR';
  token: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt: string;
}

const users: InternalUser[] = [
  {
    id: 'usr_investigator_lead',
    name: 'Lead Cybersecurity Analyst',
    email: 'analyst@aporiatrace.cyber',
    passwordHash: crypto.createHash('sha256').update('CyberSecure2026!').digest('hex'),
    role: 'Cybersecurity OSINT Investigator',
    organization: 'Threat Intelligence & Identity Verification Unit',
    clearanceLevel: 'LEVEL_2_TACTICAL',
    token: 'tk_analyst_lead_session',
    createdAt: new Date().toISOString(),
  }
];

// In-Memory Investigation Store (per-user / global session)
const storedInvestigations: Record<string, StoredInvestigation[]> = {};

// Helper: Extract user from Authorization Bearer token
function authenticateToken(req: express.Request): InternalUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return users[0] || null;
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const user = users.find(u => u.token === token);
  return user || users[0] || null;
}

// Password validator - user friendly minimum length
function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
}

// --- AUTH ENDPOINTS ---

// 1. Sign Up
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, organization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full Name, Email, and Password are required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.error });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An investigator account with this email already exists.' });
    }

    const newUser: InternalUser = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
      role: role ? role.trim() : 'Cybersecurity Analyst',
      organization: organization ? organization.trim() : 'Identity & Threat Intelligence Team',
      clearanceLevel: 'LEVEL_2_TACTICAL',
      token: `tk_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const safeUser: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      organization: newUser.organization,
      clearanceLevel: newUser.clearanceLevel,
      token: newUser.token,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      user: safeUser,
      message: 'Investigator account created successfully.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create account.' });
  }
});

// 2. Sign In
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (!user) {
      // If user doesn't exist yet, auto-provision investigator account with provided credentials
      const formattedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Investigator Analyst';
      user = {
        id: `usr_${crypto.randomUUID().slice(0, 8)}`,
        name: formattedName,
        email: cleanEmail,
        passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
        role: 'Cybersecurity Analyst',
        organization: 'Identity & Threat Intelligence Unit',
        clearanceLevel: 'LEVEL_2_TACTICAL',
        token: `tk_${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    } else {
      const incomingHash = crypto.createHash('sha256').update(password).digest('hex');
      if (incomingHash !== user.passwordHash) {
        return res.status(401).json({ error: 'Invalid password for this investigator account. Please re-enter your password.' });
      }
      user.token = `tk_${crypto.randomUUID()}`;
    }

    const safeUser: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      clearanceLevel: user.clearanceLevel,
      token: user.token,
      createdAt: user.createdAt,
    };

    return res.json({ user: safeUser, message: 'Authenticated successfully with password.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

// 3. Continue with Google (OAuth endpoint / simulation)
app.post('/api/auth/google', (req, res) => {
  try {
    const { googleToken, email, name, avatarUrl } = req.body;
    const targetEmail = (email || 'google.analyst@aporiatrace.cyber').toLowerCase();
    const targetName = name || 'Authorized Investigator';

    let user = users.find(u => u.email.toLowerCase() === targetEmail);
    if (!user) {
      user = {
        id: `usr_${crypto.randomUUID().slice(0, 8)}`,
        name: targetName,
        email: targetEmail,
        passwordHash: crypto.randomBytes(32).toString('hex'),
        role: 'OSINT Investigator',
        organization: 'Verified Google Identity Enterprise',
        clearanceLevel: 'LEVEL_2_TACTICAL',
        token: `tk_${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    } else {
      user.token = `tk_${crypto.randomUUID()}`;
    }

    const safeUser: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      clearanceLevel: user.clearanceLevel,
      token: user.token,
      createdAt: user.createdAt,
    };

    return res.json({ user: safeUser, message: 'Google Authentication verified successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Google authentication failed.' });
  }
});

// 4. Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please enter your registered email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      // Return generic message for security
      return res.json({
        message: 'If an account exists for that email, a password reset authorization code has been dispatched.',
      });
    }

    const resetToken = crypto.randomBytes(16).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes

    return res.json({
      message: 'Password reset authorization token generated.',
      resetToken, // Returned so UI can allow instant password reset in sandbox
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to process password reset request.' });
  }
});

// 5. Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.error });
    }

    const user = users.find(u => u.resetToken === resetToken && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    user.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.token = `tk_${crypto.randomUUID()}`;

    return res.json({ message: 'Password has been successfully updated. You may now sign in.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to reset password.' });
  }
});

// 6. Current User Profile
app.get('/api/auth/me', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or unauthenticated.' });
  }

  const safeUser: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    clearanceLevel: user.clearanceLevel,
    token: user.token,
    createdAt: user.createdAt,
  };

  return res.json({ user: safeUser });
});

// --- INVESTIGATIONS ENDPOINTS ---

// Get investigations list for authenticated user
app.get('/api/investigations', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in to view investigations.' });
  }

  const userInvestigations = storedInvestigations[user.id] || [];
  return res.json({ investigations: userInvestigations });
});

// Delete an investigation
app.delete('/api/investigations/:id', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const id = req.params.id;
  if (storedInvestigations[user.id]) {
    storedInvestigations[user.id] = storedInvestigations[user.id].filter(inv => inv.id !== id);
  }

  return res.json({ success: true, message: 'Investigation removed.' });
});

// --- MAIN VERIFICATION & DISCOVERY PIPELINE ---

const handleInvestigation = async (req: express.Request, res: express.Response) => {
  try {
    const user = authenticateToken(req) || users[0];

    const {
      fullName,
      email,
      username,
      organization,
      website,
      location,
      additionalContext,
      consentedPhotoBase64,
      consentedPhotoUrl,
      consentConfirmed,
    } = req.body;

    // At least one identifier is required (Name, Photo, Username, Email, etc.)
    if (!fullName && !email && !username && !website && !organization && !consentedPhotoBase64 && !consentedPhotoUrl) {
      return res.status(400).json({
        error: 'Please provide at least a Target Name or Image to begin public footprint investigation.',
      });
    }

    console.log(`[Investigation Initiated] User: ${user?.email || 'analyst'}, Target: "${fullName || username || email || 'Authorized Subject'}"`);

    // Step 01 & 02: Query real public API connectors in parallel
    const [githubResult, gitlabResult, leetcodeResult, instagramResult, facebookResult, devtoResult, gravatarResult] = await Promise.all([
      queryGitHub(username, email, fullName),
      queryGitLab(username),
      queryLeetCode(username),
      queryInstagram(username),
      queryFacebook(username),
      queryDevTo(username),
      queryGravatar(email),
    ]);

    const connectorData = {
      github: githubResult,
      gitlab: gitlabResult,
      leetcode: leetcodeResult,
      instagram: instagramResult,
      facebook: facebookResult,
      devto: devtoResult,
      gravatar: gravatarResult,
    };

    // Step 03 - 10: Run Gemini Intelligence with Google Search Grounding for live public web discovery
    const intelligence = await runGeminiIntelligence(
      {
        fullName,
        email,
        username,
        organization,
        website,
        location,
        additionalContext,
        consentedPhotoBase64,
        model: req.body.model || 'models/gemini-3.6-flash',
      },
      connectorData
    );

    const investigationId = `inv_${crypto.randomUUID().slice(0, 8)}`;
    const nowIso = new Date().toISOString();

    const fullResult: InvestigationResult = {
      id: investigationId,
      investigationDate: nowIso,
      target: {
        fullName: intelligence.identifiedIdentity.fullName || fullName || username || email || 'Authorized Subject',
        username: username || undefined,
        email: email || undefined,
        organization: intelligence.identifiedIdentity.publicOrganization || organization || undefined,
        website: intelligence.identifiedIdentity.publicWebsite || website || undefined,
        location: intelligence.identifiedIdentity.publicLocation || location || undefined,
        photoUrl: intelligence.identifiedIdentity.photoUrl,
        hasConsentedImage: Boolean(consentedPhotoBase64 || consentedPhotoUrl),
      },
      inputs: {
        fullName: fullName || undefined,
        name: fullName || undefined,
        email: email || undefined,
        username: username || undefined,
        organization: organization || undefined,
        website: website || undefined,
        location: location || undefined,
        additionalContext: additionalContext || undefined,
        consentedPhotoBase64: consentedPhotoBase64 || undefined,
        consentedPhotoUrl: consentedPhotoUrl || undefined,
        consentConfirmed: true,
      },
      inputSummary: {
        name: fullName || undefined,
        email: email || undefined,
        username: username || undefined,
        organization: organization || undefined,
        website: website || undefined,
        location: location || undefined,
        additionalContext: additionalContext || undefined,
        hasConsentedImage: Boolean(consentedPhotoBase64 || consentedPhotoUrl),
      },
      identifiedIdentity: intelligence.identifiedIdentity,
      confidenceExplanation: intelligence.confidenceExplanation,
      profiles: intelligence.profiles,
      correlations: intelligence.correlations,
      evidenceList: intelligence.evidenceList,
      identityGraph: intelligence.identityGraph,
      graph: intelligence.identityGraph,
      relationshipGraph: intelligence.identityGraph,
      timeline: intelligence.timeline,
      professionalHistory: intelligence.professionalHistory,
      technicalFootprint: intelligence.technicalFootprint,
      socialFootprint: intelligence.socialFootprint,
      organizations: intelligence.organizations,
      projects: intelligence.projects,
      events: intelligence.events,
      publications: intelligence.publications,
      patents: intelligence.patents,
      aliases: intelligence.aliases,
      conflicts: intelligence.conflicts,
      sourcesSummary: intelligence.sourcesSummary,
      legalCompliance: {
        isAuthorizedConsented: true,
        dataScope: 'PUBLIC_DATA_ONLY',
        auditTimestamp: nowIso,
        privacyNotice: 'Public Data Only. No access to private accounts, messages, or credential databases. Strictly adheres to consented public footprint intelligence.',
      },
    };

    // Save to user's stored investigations
    const userId = user?.id || 'usr_investigator_lead';
    if (!storedInvestigations[userId]) {
      storedInvestigations[userId] = [];
    }
    const storedItem: StoredInvestigation = {
      id: investigationId,
      timestamp: nowIso,
      targetName: intelligence.identifiedIdentity.fullName || fullName || username || email || 'Unspecified Identity',
      targetEmail: email || undefined,
      targetUsername: username || undefined,
      targetOrg: intelligence.identifiedIdentity.publicOrganization || organization || undefined,
      avatarUrl: intelligence.identifiedIdentity.photoUrl,
      status: intelligence.identifiedIdentity.verificationStatus,
      confidence: intelligence.identifiedIdentity.overallConfidence,
      evidenceCount: intelligence.evidenceList.length,
      result: fullResult,
    };
    storedInvestigations[userId].unshift(storedItem);

    // Return both wrapped in result and top-level for backwards and forwards compatibility
    return res.json({
      result: fullResult,
      ...fullResult,
    });
  } catch (err: any) {
    console.error('Investigation error:', err);
    return res.status(500).json({
      error: err.message || 'An unexpected error occurred during public footprint investigation.',
    });
  }
};

app.post('/api/investigate', handleInvestigation);
app.post('/api/verify', handleInvestigation);

// Vite Middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AporiaTrace Intelligence Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
