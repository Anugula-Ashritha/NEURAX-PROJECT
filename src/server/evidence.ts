import { ConnectorResult, EvidenceFinding, ExtractionResult, ResolutionResult } from './types';

export function buildEvidenceFindings(extraction: ExtractionResult, connector: ConnectorResult): EvidenceFinding[] {
  const claims = new Map<string, EvidenceFinding>();

  for (const entity of extraction.entities) {
    const key = `${entity.type}:${entity.value}`;
    const existing = claims.get(key);
    if (!existing) {
      claims.set(key, {
        claim: `${entity.type} => ${entity.value}`,
        confidence: entity.confidence,
        supportingSources: [entity.source],
        conflict: false,
        uncertainty: entity.confidence < 65,
      });
      continue;
    }

    existing.confidence = Math.min(99, Math.round((existing.confidence + entity.confidence) / 2 + 8));
    if (!existing.supportingSources.includes(entity.source)) {
      existing.supportingSources.push(entity.source);
    }
    existing.uncertainty = existing.confidence < 65;
  }

  return Array.from(claims.values()).slice(0, 30);
}

export function detectConflicts(extraction: ExtractionResult): Array<{ severity: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; description: string; investigationGuidance: string }> {
  const conflicts: Array<{ severity: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; description: string; investigationGuidance: string }> = [];

  const organizations = extraction.affiliations.map((a) => a.organization).filter(Boolean) as string[];
  if (organizations.length > 1) {
    const unique = [...new Set(organizations.map((org) => org.toLowerCase()))];
    if (unique.length > 1) {
      conflicts.push({
        severity: 'MEDIUM',
        title: 'Multiple organization claims detected',
        description: `Detected differing public organization references: ${organizations.join(', ')}.`,
        investigationGuidance: 'Verify timeline overlap and independent source corroboration for each affiliation.',
      });
    }
  }

  return conflicts;
}

export function scoreConfidence(
  connector: ConnectorResult,
  evidenceFindings: EvidenceFinding[],
  resolution: ResolutionResult,
  emailSecurity: { isDisposable: boolean; isCustomDomain: boolean },
) {
  const verified = Object.values(connector.findings).filter((f) => f.status === 'verified_match').length;
  const candidate = Object.values(connector.findings).filter((f) => f.status === 'candidate_match').length;
  const unavailable = Object.values(connector.findings).filter((f) => f.status === 'source_unavailable').length;

  let score = 20;
  score += verified * 16;
  score += candidate * 7;
  score += Math.min(20, evidenceFindings.length);
  score += Math.round(resolution.clusterConfidence * 0.2);
  if (emailSecurity.isCustomDomain) score += 8;
  if (emailSecurity.isDisposable) score -= 40;
  score -= unavailable * 4;
  score = Math.max(5, Math.min(99, score));

  const trustLevel =
    score >= 80
      ? 'VERIFIED'
      : score >= 60
      ? 'MODERATE_CONFIDENCE'
      : emailSecurity.isDisposable
      ? 'UNVERIFIED_RISK'
      : 'INSUFFICIENT_SIGNALS';

  return { score, trustLevel };
}
