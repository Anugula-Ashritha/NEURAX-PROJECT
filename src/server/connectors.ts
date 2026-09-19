import { ConnectorFinding, ConnectorResult, DiscoveryQueryPlan, SourceAttempt, SourceStatus } from './types';

const nowIso = () => new Date().toISOString();

const makeFinding = (source: keyof DiscoveryQueryPlan, partial: Partial<ConnectorFinding>): ConnectorFinding => ({
  source,
  status: partial.status || 'no_result',
  queryUsed: partial.queryUsed,
  profileUrl: partial.profileUrl,
  displayName: partial.displayName,
  handle: partial.handle,
  extractorNotes: partial.extractorNotes || 'No result',
  fetchedAt: nowIso(),
  raw: partial.raw,
});

async function safeJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return { response, data };
}

function pushAttempt(attempts: SourceAttempt[], source: keyof DiscoveryQueryPlan, query: string, status: SourceStatus, detail: string) {
  attempts.push({ source, query, status, detail });
}

async function queryGitHub(queries: string[], attempts: SourceAttempt[]): Promise<ConnectorFinding> {
  const headers = { 'User-Agent': 'AporiaTrace/real-source-only', Accept: 'application/vnd.github.v3+json' };
  for (const query of queries) {
    if (!query) continue;
    try {
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(query.replace(/^@/, ''))}`, { headers });
      if (userRes.ok) {
        const user = await userRes.json();
        pushAttempt(attempts, 'github', query, 'verified_match', 'Direct user endpoint matched');
        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(user.login)}/repos?sort=updated&per_page=10`, { headers });
        const repos = reposRes.ok ? await reposRes.json() : [];
        return makeFinding('github', {
          status: 'verified_match',
          queryUsed: query,
          profileUrl: user.html_url,
          displayName: user.name || user.login,
          handle: user.login,
          extractorNotes: 'Matched GitHub public profile via API.',
          raw: { user, repos },
        });
      }

      const { response, data } = await safeJson(`https://api.github.com/search/users?q=${encodeURIComponent(query)}+in:login`, { headers });
      if (response.ok && data?.items?.length) {
        pushAttempt(attempts, 'github', query, 'candidate_match', 'Search endpoint returned candidates');
        return makeFinding('github', {
          status: 'candidate_match',
          queryUsed: query,
          profileUrl: data.items[0].html_url,
          displayName: data.items[0].login,
          handle: data.items[0].login,
          extractorNotes: 'Search candidate found; manual confirmation recommended.',
          raw: data.items.slice(0, 5),
        });
      }
      pushAttempt(attempts, 'github', query, 'no_result', 'No profile found for query');
    } catch (error: any) {
      pushAttempt(attempts, 'github', query, 'source_unavailable', error.message || 'GitHub unavailable');
    }
  }
  return makeFinding('github', { status: 'no_result', extractorNotes: 'No GitHub match for planned queries.' });
}

async function queryDevto(queries: string[], attempts: SourceAttempt[]): Promise<ConnectorFinding> {
  for (const query of queries) {
    if (!query) continue;
    try {
      const response = await fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(query.replace(/^@/, ''))}`);
      if (response.ok) {
        const user = await response.json();
        pushAttempt(attempts, 'devto', query, 'verified_match', 'Dev.to profile matched by username');
        return makeFinding('devto', {
          status: 'verified_match',
          queryUsed: query,
          profileUrl: user.website_url || user.profile_image || `https://dev.to/${user.username}`,
          displayName: user.name || user.username,
          handle: user.username,
          extractorNotes: 'Matched Dev.to user profile via public API.',
          raw: user,
        });
      }
      pushAttempt(attempts, 'devto', query, 'no_result', 'No Dev.to user for this query');
    } catch (error: any) {
      pushAttempt(attempts, 'devto', query, 'source_unavailable', error.message || 'Dev.to unavailable');
      return makeFinding('devto', { status: 'source_unavailable', extractorNotes: 'Dev.to API unavailable.' });
    }
  }
  return makeFinding('devto', { status: 'no_result', extractorNotes: 'No Dev.to match for planned queries.' });
}

async function queryHackerNews(queries: string[], attempts: SourceAttempt[]): Promise<ConnectorFinding> {
  for (const query of queries) {
    if (!query) continue;
    try {
      const { response, data } = await safeJson(`https://hn.algolia.com/api/v1/search_by_date?tags=author_${encodeURIComponent(query.replace(/^@/, ''))}`);
      if (response.ok && data?.hits?.length) {
        pushAttempt(attempts, 'hackernews', query, 'candidate_match', 'HackerNews author hits found');
        return makeFinding('hackernews', {
          status: 'candidate_match',
          queryUsed: query,
          profileUrl: `https://news.ycombinator.com/user?id=${encodeURIComponent(query.replace(/^@/, ''))}`,
          displayName: query,
          handle: query,
          extractorNotes: 'HN Algolia returned posts/comments for author candidate.',
          raw: data.hits.slice(0, 20),
        });
      }
      pushAttempt(attempts, 'hackernews', query, 'no_result', 'No HN author results');
    } catch (error: any) {
      pushAttempt(attempts, 'hackernews', query, 'source_unavailable', error.message || 'HN unavailable');
      return makeFinding('hackernews', { status: 'source_unavailable', extractorNotes: 'HackerNews Algolia unavailable.' });
    }
  }
  return makeFinding('hackernews', { status: 'no_result', extractorNotes: 'No HackerNews match for planned queries.' });
}

async function queryArxiv(queries: string[], attempts: SourceAttempt[]): Promise<ConnectorFinding> {
  for (const query of queries) {
    if (!query) continue;
    try {
      const response = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=3`);
      const text = await response.text();
      if (response.ok && text.includes('<entry>')) {
        const title = text.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim();
        const link = text.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim();
        pushAttempt(attempts, 'arxiv', query, 'candidate_match', 'arXiv entry found');
        return makeFinding('arxiv', {
          status: 'candidate_match',
          queryUsed: query,
          profileUrl: link,
          displayName: title,
          extractorNotes: 'arXiv API returned publication candidate.',
          raw: { xml: text },
        });
      }
      pushAttempt(attempts, 'arxiv', query, 'no_result', 'No arXiv entries');
    } catch (error: any) {
      pushAttempt(attempts, 'arxiv', query, 'source_unavailable', error.message || 'arXiv unavailable');
      return makeFinding('arxiv', { status: 'source_unavailable', extractorNotes: 'arXiv source unavailable.' });
    }
  }
  return makeFinding('arxiv', { status: 'no_result', extractorNotes: 'No arXiv match for planned queries.' });
}

async function queryDuckDuckGo(queries: string[], attempts: SourceAttempt[]): Promise<ConnectorFinding> {
  for (const query of queries) {
    if (!query) continue;
    try {
      const { response, data } = await safeJson(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`);
      if (response.ok && (data?.AbstractURL || data?.RelatedTopics?.length)) {
        pushAttempt(attempts, 'duckduckgo', query, 'candidate_match', 'DuckDuckGo result found');
        return makeFinding('duckduckgo', {
          status: 'candidate_match',
          queryUsed: query,
          profileUrl: data.AbstractURL,
          displayName: data.Heading || query,
          extractorNotes: 'DuckDuckGo instant answer/related topics returned candidate evidence.',
          raw: data,
        });
      }
      pushAttempt(attempts, 'duckduckgo', query, 'no_result', 'No instant answer candidate');
    } catch (error: any) {
      pushAttempt(attempts, 'duckduckgo', query, 'source_unavailable', error.message || 'DuckDuckGo unavailable');
      return makeFinding('duckduckgo', { status: 'source_unavailable', extractorNotes: 'DuckDuckGo source unavailable.' });
    }
  }
  return makeFinding('duckduckgo', { status: 'no_result', extractorNotes: 'No DuckDuckGo candidate match.' });
}

function queryLinkedIn(queries: string[], attempts: SourceAttempt[]): ConnectorFinding {
  const query = queries[0] || '';
  let isLinkedInHost = false;
  if (query.startsWith('http')) {
    try {
      const parsed = new URL(query);
      isLinkedInHost = parsed.hostname === 'linkedin.com' || parsed.hostname.endsWith('.linkedin.com');
    } catch {
      isLinkedInHost = false;
    }
  }

  if (isLinkedInHost) {
    pushAttempt(attempts, 'linkedin', query, 'verified_match', 'Provided LinkedIn URL accepted as claimed source');
    return makeFinding('linkedin', {
      status: 'verified_match',
      queryUsed: query,
      profileUrl: query,
      displayName: 'Provided LinkedIn profile',
      extractorNotes: 'LinkedIn URL was organizer-provided; direct API lookup is not performed.',
    });
  }
  pushAttempt(attempts, 'linkedin', query, 'no_result', 'No direct LinkedIn URL provided');
  return makeFinding('linkedin', {
    status: 'no_result',
    queryUsed: query,
    profileUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    extractorNotes: 'No direct LinkedIn profile URL provided; search query retained for manual investigation.',
  });
}

export async function runSourceConnectors(plan: DiscoveryQueryPlan): Promise<ConnectorResult> {
  const attempts: SourceAttempt[] = [];

  const [github, devto, hackernews, arxiv, duckduckgo] = await Promise.all([
    queryGitHub(plan.github, attempts),
    queryDevto(plan.devto, attempts),
    queryHackerNews(plan.hackernews, attempts),
    queryArxiv(plan.arxiv, attempts),
    queryDuckDuckGo(plan.duckduckgo, attempts),
  ]);

  const linkedin = queryLinkedIn(plan.linkedin, attempts);

  return {
    findings: { github, devto, hackernews, arxiv, duckduckgo, linkedin },
    attempts,
  };
}
