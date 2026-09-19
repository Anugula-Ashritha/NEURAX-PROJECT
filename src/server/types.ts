export type SourceStatus = 'verified_match' | 'candidate_match' | 'no_result' | 'source_unavailable';

export interface VerifyInputNormalized {
  fullName: string;
  email: string;
  githubUsername?: string;
  linkedinUrl?: string;
  notes?: string;
  limitedContext: string;
  knownAliases: string[];
  photoBase64: string;
  organizerConsentAcknowledged: true;
  photoSha256: string;
}

export interface DiscoveryQueryPlan {
  github: string[];
  devto: string[];
  hackernews: string[];
  arxiv: string[];
  duckduckgo: string[];
  linkedin: string[];
}

export interface SourceAttempt {
  source: keyof DiscoveryQueryPlan;
  query: string;
  status: SourceStatus;
  detail: string;
}

export interface ConnectorFinding {
  source: keyof DiscoveryQueryPlan;
  status: SourceStatus;
  queryUsed?: string;
  profileUrl?: string;
  displayName?: string;
  handle?: string;
  extractorNotes: string;
  fetchedAt: string;
  raw?: any;
}

export interface ConnectorResult {
  findings: Record<keyof DiscoveryQueryPlan, ConnectorFinding>;
  attempts: SourceAttempt[];
}

export interface ExtractedEntity {
  id: string;
  type: 'person' | 'profile' | 'org' | 'project' | 'event' | 'publication' | 'patent' | 'claim';
  value: string;
  source: keyof DiscoveryQueryPlan;
  confidence: number;
  date?: string;
  metadata?: Record<string, any>;
}

export interface ExtractionResult {
  entities: ExtractedEntity[];
  projects: Array<{ name: string; description: string; url?: string; technologies: string[]; impactScore: number; activityStatus: string }>;
  events: Array<{ eventName: string; type: string; year: string; roleOrAchievement: string; confidence: number; evidence: string; sourceUrl?: string }>;
  publications: Array<{ title: string; type: string; url?: string; confidence: number; summary: string; year?: string; venueOrPlatform?: string }>;
  patents: Array<{ title: string; status: string; patentOrDocNumber?: string; jurisdiction?: string; year: string; summary: string; confidence: number; source?: string }>;
  affiliations: Array<{ role?: string; organization?: string; tenure?: string; confidence: number; source?: string; details?: string }>;
}

export interface ResolutionResult {
  aliasesResolved: Array<{ alias: string; platform: string; profileUrl: string; confidence: number; matchEvidence: string; status: 'CONFIRMED' | 'PROBABLE' | 'UNCERTAIN' }>;
  unresolvedCandidates: Array<{ source: string; query: string; reason: string }>;
  clusterConfidence: number;
}

export interface EvidenceFinding {
  claim: string;
  confidence: number;
  supportingSources: string[];
  conflict: boolean;
  uncertainty: boolean;
}
