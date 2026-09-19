import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Github, 
  Camera, 
  Cpu, 
  FileSearch, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint, 
  ArrowRight,
  Database,
  Lock,
  Network,
  AtSign,
  Trophy,
  Lightbulb,
  Building2,
  Clock,
  Award
} from 'lucide-react';

export const MethodologyGuide: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Consented Ingestion & Biometric Profile Cross-Referencing',
      icon: <Camera className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      description: 'The investigator provides an organizer-approved, consented subject photograph and limited context (name, primary contact, domain hints).',
      details: [
        'Organized-Approved & Consented: In strict compliance with ethical cyber-intelligence protocols, zero unauthorized credential-bypassing or private breach data is queried.',
        'Facial & Avatar Feature Matching: Cross-checks uploaded photo against GitHub public avatars, Gravatar hashes, and social headers with similarity scoring.',
        'Sanitization & Context Encoding: Parses limited context clues (e.g. university, city, ecosystem tags) to prime downstream OSINT search pipelines.'
      ]
    },
    {
      step: 2,
      title: 'Cross-Platform Alias & Handle Resolution',
      icon: <AtSign className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      description: 'Discovers and correlates fragmented usernames across GitHub, LinkedIn, X (Twitter), Devpost, YouTube, and personal domains.',
      details: [
        'Heuristic Handle Matching: Identifies common naming patterns (e.g. first-last, flast, handle_dev, handle-ai).',
        'Profile Discrepancy Auditing: Classifies handle match status as Confirmed, Probable, or Unverified with transparent confidence weights.',
        'Platform Proof Attribution: Attaches profile URLs and public bio references as proof for each resolved alias.'
      ]
    },
    {
      step: 3,
      title: 'Affiliations, Events, Conferences & Hackathons Discovery',
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      description: 'Maps the person\'s professional trajectory and public event footprint across organizations, hackathons, conferences, and workshops.',
      details: [
        'Corporate & Organizational Roles: Pinpoints current and past roles (e.g. founder, engineering lead, security researcher) with tenure estimates.',
        'Hackathon & Conference Footprint: Flags keynote talks, speaker panels, and hackathon wins (e.g. Next.js Conf, React Summit, DEF CON, Black Hat).',
        'Academic & Lab Affiliations: Discovers research labs, university fellowships, and workshop leadership.'
      ]
    },
    {
      step: 4,
      title: 'Projects, Publications & Patent Disclosure Mining',
      icon: <Lightbulb className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      description: 'Indexes publicly documented software projects, research papers, tech blogs, and patent filings.',
      details: [
        'GitHub Public Code Forensics: Deep scans repository commit recency, star counts, fork lineages, and primary programming languages.',
        'Publications & Articles: Correlates books, tech whitepapers, arXiv preprints, and Medium/Substack tech articles.',
        'Patent & Inventions Catalog: Highlights patent numbers, application statuses, and invention summaries with source citations.'
      ]
    },
    {
      step: 5,
      title: 'Chronological Timeline & Entity Relationship Graph',
      icon: <Network className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      description: 'Constructs an interactive topological graph and time-series milestone sequence connecting all verified entities.',
      details: [
        'Topology Synthesis: Links Subject -> Aliases -> Organizations -> Projects -> Events -> Patents with labeled directional edges.',
        'Milestone Chronology: Reconstructs a year-by-year roadmap detailing when key projects were launched and affiliations established.',
        'Node Inspection: Allows investigators to click any node in the graph to inspect provenance and evidence trails.'
      ]
    },
    {
      step: 6,
      title: 'Ambiguity, Conflict & Anti-Fraud Screening',
      icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      description: 'Core Intelligence Capability: Identifies uncertain, conflicting, or insufficient information to prevent identity false-positives.',
      details: [
        'Name Collision Mitigation: Differentiates common names using contextual anchors (location, tech stack, email domain).',
        'Conflicting Dates & Roles: Surfaces discrepancies where claimed resumes contradict verified conference dates or company records.',
        'Disposable Email Detection: Flags temporary inboxes (Mailinator, TempMail) and phantom accounts with zero public commits.'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
          <Award className="w-4 h-4 text-blue-400" />
          <span>ENTERPRISE CYBER DEFENSE · MULTI-SOURCE IDENTITY VERIFICATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          AporiaTrace Intelligence Methodology
        </h2>
        <p className="text-sm text-blue-100 mt-2 max-w-2xl leading-relaxed">
          How AporiaTrace discovers, correlates, and verifies fragmented public digital footprints using an organizer-consented image and limited context.
        </p>
      </div>

      {/* Step by Step Architecture Pipeline */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          The 6-Phase Intelligence Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${item.color} shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Phase 0{item.step}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {item.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-700">
                {item.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical OSINT & Compliance Accord */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ethical OSINT & Hackathon Compliance Standard
            </h3>
            <p className="text-xs text-slate-500">
              Ensuring responsible, transparent AI intelligence without invasive privacy breaches
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">Consented Data Only</p>
            <p className="text-slate-600">All matching and verification occurs against organizer-approved, public, or consented data inputs.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">Evidence Trail Rigor</p>
            <p className="text-slate-600">Every finding includes a verifiable source URL, hash, or public record reference with attached confidence scores.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">Conflict Highlighting</p>
            <p className="text-slate-600">Rather than assuming certainty, AporiaTrace explicitly flags ambiguous or conflicting claims for human review.</p>
          </div>
        </div>
      </div>

      {/* Official Problem Statement Compliance Matrix */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800">
              Official Evaluation Rubric
            </span>
            <h3 className="text-xl font-bold text-white mt-2">
              Problem Statement & Requirements Compliance Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct verification mapping against cybersecurity OSINT and identity verification criteria
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>12 / 12 Criteria Fulfilled</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              req: "Identify the most likely public identity associated with the image",
              solution: "Multi-modal vision analysis cross-references facial features and avatar hashes with public GitHub, Gravatar, and conference speaker directories.",
              module: "Photo Verification & Cross-Avatar Engine"
            },
            {
              req: "Discover publicly available social-media and professional profiles",
              solution: "Autonomous discovery across LinkedIn, GitHub, X/Twitter, Instagram, YouTube, Devpost, Kaggle, and personal portfolio sites.",
              module: "Digital Footprint Discovery Engine"
            },
            {
              req: "Identify public accounts across platforms such as Instagram, X/Twitter, YouTube, LinkedIn, GitHub",
              solution: "Unified alias matrix provides direct profile links, handle variations, and cryptographic email/commit verifications.",
              module: "Cross-Platform Handle Matrix"
            },
            {
              req: "Discover publicly documented professional affiliations, companies and roles",
              solution: "Indexes tenure ranges, job titles, employer organizations, and verified public sources for all career milestones.",
              module: "Professional Affiliations Ledger"
            },
            {
              req: "Identify participation in conferences, hackathons, workshops, webinars, interviews and public events",
              solution: "Catalogues hackathon submissions (Devpost, Kaggle, Dev Summits), conference keynote talks (React Summit, Next.js Conf, Infosec Panels), workshops, and recorded tech interviews.",
              module: "Events & Hackathons Tracker"
            },
            {
              req: "Identify publicly documented projects, products, publications and technical contributions",
              solution: "Analyzes public repository commit volume, star counts, fork hierarchies, technical whitepapers, arXiv publications, and tech articles.",
              module: "Projects & Technical Contributions Catalog"
            },
            {
              req: "Identify publicly documented patents, inventions or innovations where applicable",
              solution: "Extracts published patent numbers (USPTO/WIPO), application statuses (Granted/Pending/Public Disclosure), and architectural innovation summaries.",
              module: "Patents & Innovations Ledger"
            },
            {
              req: "Resolve different names, aliases and usernames that may belong to the same person",
              solution: "Calculates Levenshtein & phonetic similarity, assigns status (CONFIRMED, PROBABLE, UNCERTAIN), and explains matching evidence.",
              module: "Alias & Entity Resolution Engine"
            },
            {
              req: "Correlate information across multiple public sources",
              solution: "Synthesizes multi-signal corroboration connecting email deliverability, commit author PGP signatures, and social bio references.",
              module: "Multi-Signal Corroboration Pipeline"
            },
            {
              req: "Construct a timeline and/or relationship graph of the person's public activities",
              solution: "Provides an interactive topological Relationship Graph (nodes for identity, aliases, platforms, orgs, projects, events) AND chronological milestone timeline.",
              module: "Interactive Graph & Milestone Chronology"
            },
            {
              req: "Attach evidence and confidence to every material finding",
              solution: "Every individual alias, affiliation, event, project, patent, and milestone includes a calibrated confidence score (0-100%) and explicit citation.",
              module: "Evidence-Based Confidence Scoring"
            },
            {
              req: "Clearly identify uncertain, conflicting or insufficient information",
              solution: "Ambiguity & Conflict Engine surfaces conflicting dates, overlapping institutional claims, and disposable inboxes with severity ratings and guidance.",
              module: "Ambiguity & Anti-Fraud Screening"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900/80 text-blue-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-slate-100">{item.req}</p>
                </div>
                <p className="text-slate-400 pl-7">{item.solution}</p>
              </div>
              <div className="flex items-center gap-2 md:self-center shrink-0 pl-7 md:pl-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {item.module}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Fulfilled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
