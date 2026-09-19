import { ConnectorResult, ExtractionResult, ResolutionResult, VerifyInputNormalized } from './types';

export function buildRelationshipGraph(input: VerifyInputNormalized, extraction: ExtractionResult, resolution: ResolutionResult) {
  const nodes: Array<{ id: string; label: string; type: string; detail?: string; url?: string }> = [
    { id: 'person', label: input.fullName, type: 'identity' },
  ];
  const links: Array<{ source: string; target: string; relationship: string; confidence: number }> = [];

  for (const alias of resolution.aliasesResolved.slice(0, 15)) {
    const id = `alias-${alias.alias.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
    if (!nodes.some((node) => node.id === id)) {
      nodes.push({ id, label: alias.alias, type: 'alias', url: alias.profileUrl });
    }
    links.push({ source: 'person', target: id, relationship: 'uses_alias', confidence: alias.confidence });
  }

  for (const entity of extraction.entities.slice(0, 35)) {
    if (entity.type === 'person') continue;
    const id = `${entity.type}-${entity.id}`;
    if (!nodes.some((node) => node.id === id)) {
      nodes.push({ id, label: entity.value, type: entity.type, detail: entity.source, url: entity.metadata?.url });
    }
    links.push({ source: 'person', target: id, relationship: `linked_via_${entity.source}`, confidence: entity.confidence });
  }

  return { nodes, links };
}

export function buildActivityTimeline(extraction: ExtractionResult, connector: ConnectorResult) {
  const events: Array<{ id: string; yearOrDate: string; title: string; category: string; description: string; confidence: number; evidence: string; source: string }> = [];

  extraction.projects.forEach((project, index) => {
    events.push({
      id: `project-${index}`,
      yearOrDate: 'Undated',
      title: `Project: ${project.name}`,
      category: 'code',
      description: project.description,
      confidence: Math.min(95, project.impactScore),
      evidence: 'Public repository metadata',
      source: 'github',
    });
  });

  extraction.events.forEach((event, index) => {
    events.push({
      id: `event-${index}`,
      yearOrDate: event.year || 'Undated',
      title: event.eventName,
      category: event.type,
      description: event.roleOrAchievement,
      confidence: event.confidence,
      evidence: event.evidence,
      source: event.sourceUrl || 'public_source',
    });
  });

  extraction.publications.forEach((publication, index) => {
    events.push({
      id: `publication-${index}`,
      yearOrDate: publication.year || 'Undated',
      title: publication.title,
      category: publication.type,
      description: publication.summary,
      confidence: publication.confidence,
      evidence: 'Publication metadata',
      source: publication.venueOrPlatform || 'publication',
    });
  });

  Object.values(connector.findings).forEach((finding, index) => {
    if (finding.status === 'source_unavailable') {
      events.push({
        id: `source-unavailable-${index}`,
        yearOrDate: new Date().toISOString().slice(0, 10),
        title: `${finding.source} unavailable`,
        category: 'uncertainty',
        description: finding.extractorNotes,
        confidence: 20,
        evidence: finding.extractorNotes,
        source: finding.source,
      });
    }
  });

  return events.sort((a, b) => a.yearOrDate.localeCompare(b.yearOrDate));
}
