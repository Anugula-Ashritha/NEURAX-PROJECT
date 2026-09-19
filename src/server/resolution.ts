import { ConnectorResult, ExtractionResult, ResolutionResult, VerifyInputNormalized } from './types';

function tokenSimilarity(a: string, b: string): number {
  const at = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const bt = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  if (!at.size || !bt.size) return 0;
  let intersect = 0;
  for (const token of at) {
    if (bt.has(token)) intersect += 1;
  }
  return intersect / Math.max(at.size, bt.size);
}

export function resolveEntities(input: VerifyInputNormalized, connector: ConnectorResult, extraction: ExtractionResult): ResolutionResult {
  const aliasesResolved: ResolutionResult['aliasesResolved'] = [];
  const unresolvedCandidates: ResolutionResult['unresolvedCandidates'] = [];

  for (const finding of Object.values(connector.findings)) {
    if (finding.status === 'source_unavailable') {
      unresolvedCandidates.push({ source: finding.source, query: finding.queryUsed || 'n/a', reason: 'Source unavailable' });
      continue;
    }

    if (finding.status === 'no_result') {
      unresolvedCandidates.push({ source: finding.source, query: finding.queryUsed || 'n/a', reason: 'No result' });
      continue;
    }

    const display = finding.displayName || finding.handle || finding.queryUsed || '';
    const confidence = Math.round((tokenSimilarity(input.fullName, display) * 40) + (finding.status === 'verified_match' ? 55 : 35));

    aliasesResolved.push({
      alias: finding.handle ? `@${finding.handle}` : display,
      platform: String(finding.source),
      profileUrl: finding.profileUrl || '#',
      confidence,
      matchEvidence: finding.extractorNotes,
      status: confidence >= 80 ? 'CONFIRMED' : confidence >= 60 ? 'PROBABLE' : 'UNCERTAIN',
    });
  }

  for (const alias of input.knownAliases) {
    if (!aliasesResolved.some((item) => item.alias.toLowerCase().includes(alias.toLowerCase()))) {
      aliasesResolved.push({
        alias,
        platform: 'user_input',
        profileUrl: '#',
        confidence: 50,
        matchEvidence: 'Provided in known aliases input; pending source confirmation.',
        status: 'UNCERTAIN',
      });
    }
  }

  const verifiedCount = Object.values(connector.findings).filter((f) => f.status === 'verified_match').length;
  const candidateCount = Object.values(connector.findings).filter((f) => f.status === 'candidate_match').length;
  const clusterConfidence = Math.min(98, 35 + (verifiedCount * 18) + (candidateCount * 8) + Math.min(extraction.entities.length, 10));

  return { aliasesResolved, unresolvedCandidates, clusterConfidence };
}
