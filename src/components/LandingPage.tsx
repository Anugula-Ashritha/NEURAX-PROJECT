import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Lock, 
  Globe2, 
  CheckCircle2, 
  Network, 
  Layers, 
  FileText, 
  Database,
  ExternalLink,
  Cpu,
  AlertTriangle
} from 'lucide-react';

interface LandingPageProps {
  onStartInvestigation: () => void;
  onViewMethodology?: () => void;
  onOpenHowItWorks?: () => void;
  isAuthenticated?: boolean;
  onSignInRequired?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartInvestigation,
  onViewMethodology,
  onOpenHowItWorks,
  isAuthenticated = true,
  onSignInRequired,
}) => {
  const handleStart = () => {
    if (isAuthenticated) {
      onStartInvestigation();
    } else if (onSignInRequired) {
      onSignInRequired();
    } else {
      onStartInvestigation();
    }
  };

  const handleHowItWorks = () => {
    if (onViewMethodology) {
      onViewMethodology();
    } else if (onOpenHowItWorks) {
      onOpenHowItWorks();
    }
  };

  const pipelineSteps = [
    { num: '01', title: 'CONSENTED INPUT', desc: 'Authorized image, name, email & clues' },
    { num: '02', title: 'IDENTITY DISCOVERY', desc: 'Query verified public domain indexes' },
    { num: '03', title: 'PROFILE DISCOVERY', desc: 'Direct API & public platform checks' },
    { num: '04', title: 'CORRELATION', desc: 'Cross-link & heuristic signal matching' },
    { num: '05', title: 'VERIFICATION', desc: 'Strict confidence & truth scoring' },
    { num: '06', title: 'GRAPH', desc: 'Interactive topological identity map' },
    { num: '07', title: 'TIMELINE', desc: 'Publicly documented activity history' },
    { num: '08', title: 'REPORT', desc: 'Audit-ready intelligence dossier' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Clearance Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-8 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>REAL-DATA AI CYBERSECURITY INTELLIGENCE PLATFORM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-emerald-400 font-mono text-[11px]">PUBLIC DATA ONLY</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto uppercase">
            PUBLIC PROFILE & DIGITAL FOOTPRINT INTELLIGENCE
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Discover, correlate and verify publicly available digital identities across social, professional and technical platforms with an evidence-backed intelligence graph.
          </p>

          {/* Compliance & Zero-Synthetic Guarantee Pill */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real Public Sources
            </span>
            <span className="text-slate-600">•</span>
            <span>Zero Synthetic Accounts</span>
            <span className="text-slate-600">•</span>
            <span>Zero Fabricated URLs</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-mono">Consented OSINT</span>
          </div>

          {/* Primary Action Controls */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStart}
              id="hero-start-investigation-btn"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-900/30 border border-blue-400/40 transition-all flex items-center gap-3 cursor-pointer group"
            >
              <span>START INVESTIGATION</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleHowItWorks}
              id="hero-how-it-works-btn"
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-5 h-5 text-slate-400" />
              <span>HOW IT WORKS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section: CONSENTED INPUT → ... → REPORT */}
      <section className="py-12 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              INVESTIGATION WORKFLOW & OPERATIONAL PIPELINE
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {pipelineSteps.map((step, idx) => (
              <div 
                key={step.num}
                className="relative bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-400">{step.num}</span>
                  {idx < pipelineSteps.length - 1 && (
                    <span className="hidden lg:block text-slate-700 text-xs font-mono font-bold group-hover:text-blue-500 transition-colors">→</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles & Cybersecurity Safeguards */}
      <section className="py-16 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real Public Data Only</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every profile, project, event, and affiliation comes strictly from live public webpages, authorized REST APIs, or search-grounded public records. Zero synthetic filler.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Evidence-Backed Graph</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Interactive topological network connecting the individual to platforms, code repositories, employers, conferences, and published research with explainable evidence trails.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Strict Ethical Boundaries</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Never accesses private accounts, password-protected contents, or credential leaks. Full audit compliance ensuring adherence to legal public footprint standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-12 border-t border-slate-800 bg-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <blockquote className="text-base sm:text-lg font-medium text-slate-300 italic">
            "We don't just find profiles. We connect publicly available digital identities, verify relationships through evidence, and turn fragmented public information into an explainable digital footprint intelligence graph."
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase">
            <span>AporiaTrace Intelligence Core</span>
            <span className="text-slate-600">•</span>
            <span>Enterprise OSINT Architecture</span>
          </div>
        </div>
      </section>
    </div>
  );
};
