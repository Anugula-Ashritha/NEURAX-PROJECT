import { DiscoveryQueryPlan, VerifyInputNormalized } from './types';

const uniq = (items: string[]) => [...new Set(items.filter(Boolean))];

export function buildDiscoveryPlan(input: VerifyInputNormalized): DiscoveryQueryPlan {
  const baseHandles = uniq([
    input.githubUsername || '',
    ...input.knownAliases.map((a) => a.replace(/^@/, '')),
    input.fullName.toLowerCase().replace(/[^a-z0-9]/g, ''),
    input.fullName.toLowerCase().replace(/\s+/g, '.'),
  ]);

  const identityTerms = uniq([
    input.fullName,
    ...input.knownAliases,
    `${input.fullName} ${input.limitedContext}`.trim(),
  ]);

  return {
    github: uniq([input.githubUsername || '', ...baseHandles, input.fullName]).slice(0, 5),
    devto: uniq([input.githubUsername || '', ...baseHandles, input.fullName]).slice(0, 5),
    hackernews: uniq([input.githubUsername || '', ...baseHandles, input.fullName]).slice(0, 5),
    arxiv: identityTerms.slice(0, 4),
    duckduckgo: uniq([
      `${input.fullName} cybersecurity`,
      `${input.fullName} github`,
      `${input.fullName} ${input.limitedContext}`,
      ...input.knownAliases.map((a) => `${a} ${input.fullName}`),
    ]).slice(0, 6),
    linkedin: input.linkedinUrl ? [input.linkedinUrl] : [`site:linkedin.com/in \"${input.fullName}\"`],
  };
}
