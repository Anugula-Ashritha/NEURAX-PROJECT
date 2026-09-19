import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { runVerificationPipeline } from './src/server/orchestrator';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'OSINT Investigator' | 'Cybersecurity Analyst' | 'Neurax Hackathon Judge' | 'Identity Screening Officer';
  organization: string;
  clearanceLevel: 'LEVEL_1_BASIC' | 'LEVEL_2_TACTICAL' | 'LEVEL_3_DIRECTOR';
  token: string;
}

const users: StoredUser[] = [];
const authRateLimit = new Map<string, { count: number; windowStart: number }>();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const incomingHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(incomingHash, 'hex'));
}

function isRateLimited(ipAddress: string, limit = 10, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = authRateLimit.get(ipAddress);

  if (!current || now - current.windowStart > windowMs) {
    authRateLimit.set(ipAddress, { count: 1, windowStart: now });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count += 1;
  authRateLimit.set(ipAddress, current);
  return false;
}

app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (users.some((user) => user.email === cleanEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists in AporiaTrace.' });
    }

    const newUser: StoredUser = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash: hashPassword(String(password)),
      role: role || 'OSINT Investigator',
      organization: organization ? String(organization).trim() : 'Independent Intelligence Team',
      clearanceLevel: role === 'Neurax Hackathon Judge' ? 'LEVEL_3_DIRECTOR' : 'LEVEL_2_TACTICAL',
      token: `tk_${crypto.randomUUID()}`,
    };

    users.push(newUser);

    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
        clearanceLevel: newUser.clearanceLevel,
        token: newUser.token,
      },
      message: 'Investigator credentials provisioned successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to sign up investigator.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ipAddress)) {
      return res.status(429).json({ error: 'Too many login attempts. Please retry later.' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = users.find((entry) => entry.email === cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid investigator email or password.' });
    }

    if (!verifyPassword(String(password), user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid investigator email or password.' });
    }

    user.token = `tk_${crypto.randomUUID()}`;

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        clearanceLevel: user.clearanceLevel,
        token: user.token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Login failed.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization token.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const user = users.find((entry) => entry.token === token);

  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      clearanceLevel: user.clearanceLevel,
      token: user.token,
    },
  });
});

app.post('/api/verify', async (req, res) => {
  try {
    const result = await runVerificationPipeline(req.body);
    return res.json(result);
  } catch (error: any) {
    const status = /required|consent|invalid/i.test(error.message || '') ? 400 : 500;
    return res.status(status).json({ error: error.message || 'Internal server error during footprint correlation' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AporiaTrace', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AporiaTrace Intelligence Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
