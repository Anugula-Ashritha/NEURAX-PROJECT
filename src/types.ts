export type VerificationStatus = 'Verified' | 'Strong Match' | 'Possible Match' | 'Uncertain' | 'Conflicting';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CONFLICTING';

export type EntityType = 
  | 'Person' 
  | 'Profile' 
  | 'Organization' 
  | 'Company' 
  | 'Project' 
  | 'Event' 
  | 'Publication' 
  | 'Patent' 
  | 'Website' 
  | 'Alias';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  clearanceLevel: 'LEVEL_1_STANDARD' | 'LEVEL_2_TACTICAL' | 'LEVEL_3_DIRECTOR';
  token: string;
  createdAt?: string;
}

export interface InvestigationInput {
  name?: string;
  fullName?: string;
  email?: string;
  username?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  organization?: string;
  website?: string;
  location?: string;
  notes?: string;
  additionalContext?: string;
  consentedPhotoBase64?: string;
  photoBase64?: string;
  consentedPhotoUrl?: string;
  consentConfirmed?: boolean;
}

export interface DiscoveredProfile {
  id: string;
  platform: string; // GitHub, LinkedIn, X / Twitter, LeetCode, HackerRank, Facebook, Instagram, YouTube, etc.
  category: 'social' | 'professional' | 'technical' | 'research' | 'events';
  username?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  profileUrl?: string; // Must be a real verified working clickable URL
  location?: string;
  website?: string;
  followers?: number | string;
  following?: number | string;
  publicRepos?: number;
  solvedProblems?: number | string;
  ranking?: string | number;
  currentCompany?: string;
  headline?: string;
  publicActivity?: string;
  verification: VerificationStatus;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  confidenceReasoning: string;
  isAvailable: boolean;
  unavailableReason?: 'Source unavailable' | 'Unable to verify this source.';
  verifiedFields: string[]; // List of fields that actually exist on public profile
}

export interface CorrelationSignal {
  id: string;
  type: 'Name Match' | 'Username Match' | 'Website Match' | 'Organization Match' | 'Project Match' | 'Biography Match' | 'Cross-Link' | 'Email Match';
  description: string;
  platformsInvolved: string[];
  evidence: string;
  sourceUrls: Array<{ label: string; url: string }>;
  confidence: ConfidenceLevel;
}

export interface EvidenceItem {
  id: string;
  finding: string;
  source: string;
  sourceType: 'Social' | 'Professional' | 'Technical' | 'Organization' | 'Event' | 'Publication';
  sourceUrl: string; // real clickable URL
  evidence: string;
  verification: 'Verified' | 'Corroborated' | 'Possible' | 'Uncertain' | 'Conflicting';
  confidence: ConfidenceLevel;
  checkedAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  platform?: string;
  detail?: string;
  url?: string;
  confidence?: ConfidenceLevel;
  verification?: VerificationStatus;
  evidence?: string;
  source?: string;
  sourceUrl?: string;
  isCenter?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  confidence: number;
}

export interface DigitalIdentityGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  organization?: string;
  category: 'Education' | 'Employment' | 'Projects' | 'Publications' | 'Conferences' | 'Hackathons' | 'Open Source' | 'Public Appearance';
  source: string;
  sourceUrl?: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface ProfessionalItem {
  id: string;
  role: string;
  organization: string;
  period?: string;
  isCurrent?: boolean;
  type: 'Current Role' | 'Previous Role' | 'Education' | 'Certification' | 'Affiliation';
  skills?: string[];
  source: string;
  sourceUrl?: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface TechnicalFootprintItem {
  id: string;
  platform: string;
  username: string;
  name?: string;
  bio?: string;
  profileUrl?: string;
  stats: Record<string, string | number>;
  topLanguages?: string[];
  recentProjects?: Array<{
    name: string;
    url?: string;
    description?: string;
    language?: string;
    stars?: number;
    forks?: number;
  }>;
  source: string;
  evidence: string;
  verification: VerificationStatus;
  confidence: ConfidenceLevel;
}

export interface OrganizationItem {
  id: string;
  name: string;
  type: 'Company' | 'Startup' | 'University' | 'Institution' | 'Community' | 'Professional Organization';
  role?: string;
  relationship: string;
  period?: string;
  source: string;
  sourceUrl?: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  authorOrAssociation?: string;
  repositoryUrl?: string;
  websiteUrl?: string;
  source: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface EventItem {
  id: string;
  name: string;
  date?: string;
  role?: string;
  organization?: string;
  description: string;
  type: 'Hackathon' | 'Conference' | 'Workshop' | 'Webinar' | 'Meetup' | 'Competition' | 'Panel' | 'Interview';
  source: string;
  sourceUrl?: string; // actual event URL
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface PublicationItem {
  id: string;
  title: string;
  author?: string;
  date?: string;
  publicationVenue?: string;
  type: 'Research Paper' | 'Article' | 'Technical Blog' | 'Interview' | 'Presentation' | 'Publication';
  description: string;
  source: string;
  sourceUrl?: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface PatentItem {
  id: string;
  title: string;
  inventor?: string;
  organization?: string;
  patentNumber?: string;
  date?: string;
  description: string;
  officialSource: string;
  sourceUrl?: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface AliasItem {
  id: string;
  alias: string;
  platformOrContext: string;
  possibleRelationship: string;
  evidence: string;
  sourceLinks: Array<{ label: string; url: string }>;
  confidence: ConfidenceLevel;
  verification: VerificationStatus;
}

export interface ConflictItem {
  id: string;
  title: string;
  description: string;
  sourceA: {
    name: string;
    claim: string;
    url?: string;
  };
  sourceB: {
    name: string;
    claim: string;
    url?: string;
  };
  status: 'Requires verification';
  investigationGuidance: string;
}

export interface IdentifiedIdentity {
  photoUrl?: string;
  fullName?: string;
  canonicalUsername?: string;
  headline?: string;
  publicUsernames: string[];
  publicLocation?: string;
  publicWebsite?: string;
  publicOrganization?: string;
  publicRole?: string;
  publicBio?: string;
  verificationStatus: VerificationStatus;
  overallConfidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  evidenceCount: number;
  identifiedFields: string[]; // only fields actually discovered
}

export interface ConfidenceExplanation {
  overallScore: number;
  level: ConfidenceLevel;
  summary: string;
  signals: Array<{
    name: string;
    impact: 'STRONG_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'WARNING' | 'NEGATIVE';
    scoreContribution: string;
    description: string;
    verifiedSourcesCount: number;
  }>;
}

export interface InvestigationResult {
  id: string;
  investigationDate: string;
  inputs?: InvestigationInput;
  inputSummary: {
    name?: string;
    email?: string;
    username?: string;
    organization?: string;
    website?: string;
    location?: string;
    additionalContext?: string;
    hasConsentedImage: boolean;
  };
  identifiedIdentity: IdentifiedIdentity;
  confidenceExplanation: ConfidenceExplanation;
  profiles: DiscoveredProfile[];
  correlations: CorrelationSignal[];
  evidenceList: EvidenceItem[];
  identityGraph: DigitalIdentityGraph;
  graph?: DigitalIdentityGraph;
  relationshipGraph?: DigitalIdentityGraph;
  timeline: TimelineEvent[];
  professionalHistory: ProfessionalItem[];
  technicalFootprint: TechnicalFootprintItem[];
  socialFootprint: DiscoveredProfile[];
  organizations: OrganizationItem[];
  projects: ProjectItem[];
  events: EventItem[];
  publications: PublicationItem[];
  patents: PatentItem[];
  aliases: AliasItem[];
  conflicts: ConflictItem[];
  sourcesSummary: Array<{
    name: string;
    url: string;
    type: string;
    status: 'Verified Accessible' | 'Official Source';
  }>;
  legalCompliance: {
    isAuthorizedConsented: boolean;
    dataScope: 'PUBLIC_DATA_ONLY';
    auditTimestamp: string;
    privacyNotice: string;
  };

  // Legacy/Compatibility fields for legacy components if referenced
  target?: any;
  candidate?: any;
  overallTrustScore?: number;
  trustLevel?: string;
  executiveSummary?: string;
  currentActivity?: any;
  socialProfiles?: any;
  emailSecurity?: any;
  photoVerification?: any;
  projectHighlights?: any;
  riskSignals?: any;
  interviewQuestions?: any;
  verificationTimestamp?: string;
  aliasesResolved?: any;
  professionalAffiliations?: any;
  eventsParticipation?: any;
  publicationsAndContributions?: any;
  patentsAndInnovations?: any;
  activityTimeline?: any;
  conflictsAndAmbiguities?: any;
}

export interface StoredInvestigation {
  id: string;
  timestamp: string;
  targetName: string;
  targetEmail?: string;
  targetUsername?: string;
  targetOrg?: string;
  avatarUrl?: string;
  status: VerificationStatus;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  result: InvestigationResult;
}

// Backward compatibility aliases
export type CandidateInput = InvestigationInput;
export type VerificationResult = InvestigationResult;
export type RelationshipGraph = DigitalIdentityGraph;

