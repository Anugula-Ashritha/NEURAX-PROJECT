import { ConnectorResult, ExtractionResult, ExtractedEntity, VerifyInputNormalized } from './types';

const yearFromDate = (value?: string) => {
  if (!value) return undefined;
  const match = value.match(/\d{4}/);
  return match?.[0];
};

export function extractStructuredData(input: VerifyInputNormalized, connector: ConnectorResult): ExtractionResult {
  const entities: ExtractedEntity[] = [
    {
      id: 'person-primary',
      type: 'person',
      value: input.fullName,
      source: 'duckduckgo',
      confidence: 90,
    },
  ];

  const projects: ExtractionResult['projects'] = [];
  const events: ExtractionResult['events'] = [];
  const publications: ExtractionResult['publications'] = [];
  const patents: ExtractionResult['patents'] = [];
  const affiliations: ExtractionResult['affiliations'] = [];

  const github = connector.findings.github;
  if (github.status !== 'no_result' && github.status !== 'source_unavailable' && github.raw?.user) {
    const user = github.raw.user;
    entities.push({
      id: 'profile-github',
      type: 'profile',
      value: user.html_url || github.profileUrl || '',
      source: 'github',
      confidence: github.status === 'verified_match' ? 96 : 78,
      metadata: { handle: user.login },
    });

    if (user.company) {
      affiliations.push({
        role: 'Public profile affiliation',
        organization: String(user.company).replace(/^@/, ''),
        tenure: user.created_at ? `${yearFromDate(user.created_at)} - Present` : 'Unknown',
        confidence: 84,
        source: 'GitHub',
        details: 'Derived from public GitHub profile company field.',
      });
      entities.push({
        id: 'org-github-company',
        type: 'org',
        value: String(user.company).replace(/^@/, ''),
        source: 'github',
        confidence: 80,
      });
    }

    for (const repo of (github.raw.repos || []).slice(0, 8)) {
      projects.push({
        name: repo.name,
        description: repo.description || 'Public repository',
        url: repo.html_url,
        technologies: [repo.language].filter(Boolean),
        impactScore: Math.min(99, 45 + ((repo.stargazers_count || 0) * 3) + ((repo.forks_count || 0) * 5)),
        activityStatus: 'Active',
      });
      entities.push({
        id: `project-${repo.name}`,
        type: 'project',
        value: repo.name,
        source: 'github',
        confidence: 85,
        date: repo.updated_at,
        metadata: { url: repo.html_url, language: repo.language },
      });
    }
  }

  const devto = connector.findings.devto;
  if (devto.status !== 'no_result' && devto.status !== 'source_unavailable' && devto.raw) {
    entities.push({
      id: 'profile-devto',
      type: 'profile',
      value: `https://dev.to/${devto.raw.username || devto.handle}`,
      source: 'devto',
      confidence: devto.status === 'verified_match' ? 88 : 70,
      metadata: { handle: devto.raw.username || devto.handle },
    });
    publications.push({
      title: `Dev.to profile activity for ${devto.raw.name || devto.raw.username}`,
      type: 'article',
      url: `https://dev.to/${devto.raw.username || devto.handle}`,
      confidence: devto.status === 'verified_match' ? 80 : 66,
      summary: 'Public engineering blog/profile discovered via Dev.to API.',
      venueOrPlatform: 'Dev.to',
    });
  }

  const hn = connector.findings.hackernews;
  if (hn.status !== 'no_result' && hn.status !== 'source_unavailable' && Array.isArray(hn.raw)) {
    const firstHit = hn.raw[0];
    events.push({
      eventName: 'Hacker News public contribution trail',
      type: 'community',
      year: yearFromDate(firstHit?.created_at) || 'Unknown',
      roleOrAchievement: 'Public discussion/activity footprint',
      confidence: hn.status === 'verified_match' ? 80 : 68,
      evidence: 'HackerNews Algolia author hits.',
      sourceUrl: hn.profileUrl,
    });
  }

  const arxiv = connector.findings.arxiv;
  if (arxiv.status !== 'no_result' && arxiv.status !== 'source_unavailable' && arxiv.raw?.xml) {
    const title = arxiv.raw.xml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim();
    const updated = arxiv.raw.xml.match(/<updated>([\s\S]*?)<\/updated>/)?.[1]?.trim();
    publications.push({
      title: title || 'arXiv publication candidate',
      type: 'paper',
      url: arxiv.profileUrl,
      confidence: arxiv.status === 'verified_match' ? 84 : 70,
      summary: 'Extracted from arXiv public API query.',
      year: yearFromDate(updated),
      venueOrPlatform: 'arXiv',
    });
    entities.push({
      id: 'publication-arxiv',
      type: 'publication',
      value: title || 'arXiv candidate',
      source: 'arxiv',
      confidence: 72,
      date: updated,
      metadata: { url: arxiv.profileUrl },
    });
  }

  const duck = connector.findings.duckduckgo;
  if (duck.status !== 'no_result' && duck.status !== 'source_unavailable' && duck.raw) {
    const heading = duck.raw.Heading || input.fullName;
    entities.push({
      id: 'claim-duckduckgo',
      type: 'claim',
      value: heading,
      source: 'duckduckgo',
      confidence: 62,
      metadata: { abstract: duck.raw.AbstractText, url: duck.raw.AbstractURL },
    });
  }

  return { entities, projects, events, publications, patents, affiliations };
}
