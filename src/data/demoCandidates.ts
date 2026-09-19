export interface DemoCandidate {
  id: string;
  name: string;
  email: string;
  githubUsername: string;
  linkedinUrl: string;
  photoUrl: string;
  role: string;
  notes: string;
  limitedContext: string;
  knownAliases: string;
  category: 'senior_engineer' | 'security_researcher' | 'founder' | 'conflicting_ambiguous' | 'suspicious';
}

export const DEMO_CANDIDATES: DemoCandidate[] = [
  {
    id: '1',
    name: 'Guillermo Rauch',
    email: 'rauchg@gmail.com',
    githubUsername: 'rauchg',
    linkedinUrl: 'https://www.linkedin.com/in/rauchg',
    photoUrl: 'https://avatars.githubusercontent.com/u/13041?v=4',
    role: 'CEO at Vercel / Creator of Next.js & Socket.io',
    notes: 'Organizer-consented public footprint profile. Keynote speaker at Next.js Conf, React Summit, author of distributed web infrastructure.',
    limitedContext: 'Known tech founder, San Francisco / Argentina, Node.js ecosystem pioneer, public GitHub since 2008.',
    knownAliases: '@rauchg, Guillermo Rauch, rauchg.com',
    category: 'founder',
  },
  {
    id: '2',
    name: 'Addy Osmani',
    email: 'addyosmani@gmail.com',
    githubUsername: 'addyosmani',
    linkedinUrl: 'https://www.linkedin.com/in/addyosmani',
    photoUrl: 'https://avatars.githubusercontent.com/u/110953?v=4',
    role: 'Engineering Lead at Google Chrome & Author',
    notes: 'Published O\'Reilly books, Chrome Dev Summit speaker, Web Performance & JavaScript design patterns.',
    limitedContext: 'Google Chrome engineering leadership, London / Mountain View, public technical publications, patents in web rendering optimizations.',
    knownAliases: '@addyosmani, addyosmani.com, Addy O.',
    category: 'senior_engineer',
  },
  {
    id: '3',
    name: 'Marcus Holloway',
    email: 'm.holloway.research@proton.me',
    githubUsername: 'marcus-sec-labs',
    linkedinUrl: 'https://www.linkedin.com/in/marcus-holloway-cyber',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'Cryptographic & OSINT Security Researcher',
    notes: 'Independent vulnerability researcher, published advisory notes on zero-knowledge identity protocols, active CTF participant.',
    limitedContext: 'Security analyst, active cryptography and network security open source repos, public speaking at regional BSides conferences.',
    knownAliases: '@holloway_sec, mholloway, Marcus H.',
    category: 'security_researcher',
  },
  {
    id: '4',
    name: 'Dr. Elena Vance (Conflicting Discrepancy Test)',
    email: 'elena.vance.ai@gmail.com',
    githubUsername: 'elena-vance-research',
    linkedinUrl: 'https://www.linkedin.com/in/elena-vance-ai',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    role: 'AI Researcher & Claimed Lab Director',
    notes: 'Case study demonstrating conflict resolution: Profile names match on Instagram and GitHub, but stated university affiliation in 2024 conflicts with conference proceedings authorship.',
    limitedContext: 'Subject uses multiple handles: @elena_vance, @evance_cyber, claimed tenure at two overlapping institutions.',
    knownAliases: '@elena_vance, @evance_cyber, Dr. E. Vance',
    category: 'conflicting_ambiguous',
  },
  {
    id: '5',
    name: 'Alex Phantom (Suspicious Disposable Inbox Test)',
    email: 'phantom.candidate883@mailinator.com',
    githubUsername: 'nonexistent-user-xyz-987654',
    linkedinUrl: '',
    photoUrl: '',
    role: 'Claimed 10+ Years Defense Cloud Architect',
    notes: 'Provided a disposable temporary inbox (mailinator.com) with zero verified public commits, phantom claims, and no verifiable social presence.',
    limitedContext: 'Claims defense contracting clearance but uses throwaway mail and untraceable handles.',
    knownAliases: '@phantom_ops_unverified',
    category: 'suspicious',
  },
];
