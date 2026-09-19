export interface CandidateInput {
  fullName: string;
  email: string;
  photoUrl?: string;
  photoBase64?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

export interface GitHubProfile {
  found: boolean;
  login?: string;
  name?: string;
  avatar_url?: string;
  html_url?: string;
  bio?: string | null;
  location?: string | null;
  company?: string | null;
  blog?: string | null;
  public_repos?: number;
  followers?: number;
  created_at?: string;
  updated_at?: string;
  topLanguages?: string[];
  recentRepos?: GitHubRepo[];
}

export interface GravatarProfile {
  found: boolean;
  avatarUrl?: string;
  profileUrl?: string;
  hash: string;
}

export interface EmailSecurityCheck {
  domain: string;
  isDisposable: boolean;
  isCustomDomain: boolean;
  isKnownCorporateDomain: boolean;
  formatValid: boolean;
  providerType: 'corporate' | 'public_freemail' | 'disposable' | 'custom_domain';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PhotoVerification {
  uploaded: boolean;
  matchedPublicAvatar: boolean;
  confidence: number; // 0 - 100
  analysisNotes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'OSINT Investigator' | 'Cybersecurity Analyst' | 'Senior Intelligence Director' | 'Identity Screening Officer';
  organization: string;
  clearanceLevel: 'LEVEL_1_BASIC' | 'LEVEL_2_TACTICAL' | 'LEVEL_3_DIRECTOR';
  token: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'identity' | 'alias' | 'platform' | 'organization' | 'project' | 'event' | 'patent' | string;
  detail?: string;
  url?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  confidence: number;
}

export interface RelationshipGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface VerificationResult {
  candidate: {
    fullName: string;
    email: string;
    photoPreview?: string;
    githubUsername?: string;
    linkedinUrl?: string;
    company?: string;
    title?: string;
  };
  overallTrustScore: number; // 0 - 100
  trustLevel: 'VERIFIED' | 'MODERATE_CONFIDENCE' | 'UNVERIFIED_RISK' | 'INSUFFICIENT_SIGNALS';
  executiveSummary: string;
  currentActivity: {
    titleRole: string;
    focusAreas: string[];
    currentProjects: string[];
    statusSummary: string;
  };
  socialProfiles: {
    github: GitHubProfile;
    gravatar: GravatarProfile;
    linkedin: {
      inferredUrl?: string;
      searchUrl: string;
      status: 'VERIFIED_LINK' | 'SEARCH_INDEXED' | 'MANUAL_REQUIRED';
      headline?: string;
    };
    twitterX?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    instagram?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    youtube?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    reddit?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    devpost?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    kaggle?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    medium?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    discord?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    scholar?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
    gitlab?: {
      searchUrl: string;
      inferredHandle?: string;
      status?: string;
    };
  };
  emailSecurity: EmailSecurityCheck;
  photoVerification: PhotoVerification;
  projectHighlights: Array<{
    name: string;
    description: string;
    url?: string;
    technologies: string[];
    impactScore: number;
    activityStatus: string;
  }>;
  riskSignals: Array<{
    type: 'positive' | 'warning' | 'negative';
    title: string;
    detail: string;
  }>;
  interviewQuestions: Array<{
    question: string;
    targetProjectOrSkill: string;
    reasoning: string;
  }>;
  aliasesResolved?: Array<{
    alias: string;
    platform: string;
    profileUrl: string;
    confidence: number;
    matchEvidence: string;
    status: 'CONFIRMED' | 'PROBABLE' | 'UNCERTAIN';
  }>;
  professionalAffiliations?: Array<{
    role?: string;
    organization?: string;
    company?: string;
    tenure?: string;
    duration?: string;
    status?: string;
    confidence: number;
    source?: string;
    verifiedSource?: string;
    details?: string;
  }>;
  eventsParticipation?: Array<{
    eventName?: string;
    name?: string;
    type: string;
    year: string;
    role?: string;
    roleOrAchievement?: string;
    confidence: number;
    evidence: string;
    sourceUrl?: string;
  }>;
  publicationsAndContributions?: Array<{
    title: string;
    type: string;
    url?: string;
    confidence: number;
    summary: string;
    year?: string;
    venueOrPlatform?: string;
  }>;
  patentsAndInnovations?: Array<{
    title: string;
    status: string;
    patentNumber?: string;
    patentOrDocNumber?: string;
    docNumber?: string;
    jurisdiction?: string;
    year: string;
    summary: string;
    confidence: number;
    source?: string;
  }>;
  activityTimeline?: Array<{
    id?: string;
    year?: string;
    yearOrDate?: string;
    title: string;
    category: string;
    description: string;
    confidence: number;
    evidence: string;
    source: string;
  }>;
  relationshipGraph?: RelationshipGraph;
  conflictsAndAmbiguities?: Array<{
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    investigationGuidance: string;
  }>;
  consentCompliance?: {
    isOrganizerConsented: boolean;
    dataScope: string;
    legalAuditId: string;
    verifiedTimestamp: string;
  };
  verificationTimestamp: string;
}
