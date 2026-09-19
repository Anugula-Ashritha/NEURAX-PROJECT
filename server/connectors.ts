import crypto from 'node:crypto';

// Reusable user agent for external requests
const USER_AGENT = 'AporiaTrace-DigitalFootprintIntelligence/1.0 (Cybersecurity Public Profile Correlator)';

// Real GitHub Connector
export async function queryGitHub(username?: string, email?: string, name?: string) {
  const headers: Record<string, string> = {
    'User-Agent': USER_AGENT,
    'Accept': 'application/vnd.github.v3+json',
  };

  try {
    let resolvedUsername = username?.trim().replace(/^@/, '');

    // If username not provided or not found, try searching by email
    if (!resolvedUsername && email) {
      const searchRes = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(email)}+in:email`, { headers });
      if (searchRes.ok) {
        const searchData = await searchRes.json() as any;
        if (searchData.items && searchData.items.length > 0) {
          resolvedUsername = searchData.items[0].login;
        }
      }
    }

    // If still not found, try searching by exact full name
    if (!resolvedUsername && name && name.trim().length > 2) {
      const searchRes = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(name.trim())}+in:fullname`, { headers });
      if (searchRes.ok) {
        const searchData = await searchRes.json() as any;
        if (searchData.items && searchData.items.length > 0) {
          resolvedUsername = searchData.items[0].login;
        }
      }
    }

    if (!resolvedUsername) {
      return { available: false, reason: 'Source unavailable' as const };
    }

    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(resolvedUsername)}`, { headers });
    if (!userRes.ok) {
      return { available: false, reason: 'Unable to verify this source.' as const };
    }

    const user = await userRes.json() as any;

    // Fetch public repositories
    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(resolvedUsername)}/repos?sort=updated&per_page=12`, { headers });
    let repos: any[] = [];
    if (reposRes.ok) {
      repos = await reposRes.json() as any[];
    }

    const languagesMap: Record<string, number> = {};
    for (const r of repos) {
      if (r.language) {
        languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
      }
    }

    const topLanguages = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    return {
      available: true,
      username: user.login,
      name: user.name || undefined,
      avatarUrl: user.avatar_url || undefined,
      profileUrl: user.html_url,
      bio: user.bio || undefined,
      location: user.location || undefined,
      website: user.blog || undefined,
      company: user.company || undefined,
      publicRepos: typeof user.public_repos === 'number' ? user.public_repos : undefined,
      followers: typeof user.followers === 'number' ? user.followers : undefined,
      following: typeof user.following === 'number' ? user.following : undefined,
      createdAt: user.created_at || undefined,
      updatedAt: user.updated_at || undefined,
      topLanguages,
      repos: repos.map(r => ({
        name: r.name,
        url: r.html_url,
        description: r.description || undefined,
        language: r.language || undefined,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at,
        topics: r.topics || [],
      })),
    };
  } catch {
    return { available: false, reason: 'Source unavailable' as const };
  }
}

// Real GitLab Connector
export async function queryGitLab(username?: string) {
  if (!username) return { available: false, reason: 'Source unavailable' as const };
  const cleanUsername = username.trim().replace(/^@/, '');

  try {
    const res = await fetch(`https://gitlab.com/api/v4/users?username=${encodeURIComponent(cleanUsername)}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    if (!res.ok) return { available: false, reason: 'Source unavailable' as const };

    const users = await res.json() as any[];
    if (!users || users.length === 0) {
      return { available: false, reason: 'Source unavailable' as const };
    }

    const user = users[0];
    return {
      available: true,
      username: user.username,
      name: user.name || undefined,
      avatarUrl: user.avatar_url || undefined,
      profileUrl: user.web_url,
      bio: user.bio || undefined,
      location: user.location || undefined,
      website: user.website_url || undefined,
      organization: user.organization || undefined,
    };
  } catch {
    return { available: false, reason: 'Source unavailable' as const };
  }
}

// Real LeetCode Public Connector
export async function queryLeetCode(username?: string) {
  if (!username) return { available: false, reason: 'Source unavailable' as const };
  const clean = username.trim().replace(/^@/, '');

  // Check if profile URL itself is reachable with status 200
  const profileUrl = `https://leetcode.com/${clean}`;
  const isReachable = await verifyUrlReachable(profileUrl);
  if (isReachable) {
    return {
      available: true,
      username: clean,
      profileUrl,
    };
  }

  return { available: false, reason: 'Source unavailable' as const };
}

// Real Instagram Public Connector
export async function queryInstagram(username?: string) {
  if (!username) return { available: false, reason: 'Source unavailable' as const };
  const clean = username.trim().replace(/^@/, '');

  const profileUrl = `https://www.instagram.com/${clean}/`;
  const isReachable = await verifyUrlReachable(profileUrl);
  if (isReachable) {
    return {
      available: true,
      username: clean,
      profileUrl,
    };
  }
  return { available: false, reason: 'Source unavailable' as const };
}

// Real Facebook Public Connector
export async function queryFacebook(username?: string) {
  if (!username) return { available: false, reason: 'Source unavailable' as const };
  const clean = username.trim().replace(/^@/, '');

  const profileUrl = `https://www.facebook.com/${clean}/`;
  const isReachable = await verifyUrlReachable(profileUrl);
  if (isReachable) {
    return {
      available: true,
      username: clean,
      profileUrl,
    };
  }
  return { available: false, reason: 'Source unavailable' as const };
}

// Real Dev.to Connector
export async function queryDevTo(username?: string) {
  if (!username) return { available: false, reason: 'Source unavailable' as const };
  const clean = username.trim().replace(/^@/, '');

  try {
    const res = await fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(clean)}`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const user = await res.json() as any;
      if (user && user.id) {
        return {
          available: true,
          username: user.username,
          name: user.name || undefined,
          bio: user.summary || undefined,
          avatarUrl: user.profile_image || undefined,
          profileUrl: `https://dev.to/${user.username}`,
          website: user.website_url || undefined,
          location: user.location || undefined,
        };
      }
    }
  } catch {
    // Dev.to query error
  }
  return { available: false, reason: 'Source unavailable' as const };
}

// Real Gravatar Hash Check
export async function queryGravatar(email?: string) {
  if (!email || !email.includes('@')) {
    return { available: false, reason: 'Source unavailable' as const };
  }

  const cleanEmail = email.trim().toLowerCase();
  const hash = crypto.createHash('md5').update(cleanEmail).digest('hex');
  const avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;

  try {
    const res = await fetch(avatarUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    if (res.status === 200) {
      return {
        available: true,
        avatarUrl: `https://www.gravatar.com/avatar/${hash}?s=256`,
        profileUrl: `https://gravatar.com/${hash}`,
        hash,
      };
    }
  } catch {
    // Ignore Gravatar head failure
  }

  return { available: false, reason: 'Source unavailable' as const };
}

// Real URL reachable checker (Returns true if status 200)
export async function verifyUrlReachable(url: string): Promise<boolean> {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;

  try {
    const parsed = new URL(url);
    // Ignore localhost or private IPs
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)) return false;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      method: 'GET', // Use GET to get the full page, more reliable for status
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Range': 'bytes=0-1000', // Small range for speed
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);
    return response.status === 200; // MUST be 200
  } catch {
    return false;
  }
}
