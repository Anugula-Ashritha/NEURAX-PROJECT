import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  BookOpen, 
  History, 
  User, 
  LogOut, 
  Lock, 
  KeyRound, 
  Fingerprint, 
  AlertCircle,
  Activity,
  Globe2,
  Cpu,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CandidateForm } from './components/CandidateForm';
import { VerificationResults } from './components/VerificationResults';
import { MethodologyGuide } from './components/MethodologyGuide';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { CandidateInput, VerificationResult, UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'screener' | 'guide' | 'history' | 'auth'>('screener');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('Initiating AporiaTrace pipeline...');
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VerificationResult[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Load session and history from localStorage on startup, or default to an active investigator session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aporiatrace_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } else {
        // Default authorized investigator session for instant evaluation
        const defaultUser: UserProfile = {
          id: 'usr_sec_lead',
          name: 'Lead OSINT Officer',
          email: 'investigator@cybersec-core.org',
          role: 'Cybersecurity Analyst',
          organization: 'Threat Intelligence Unit',
          clearanceLevel: 'LEVEL_2_TACTICAL',
          token: 'tk_live_session',
        };
        setCurrentUser(defaultUser);
        localStorage.setItem('aporiatrace_auth_user', JSON.stringify(defaultUser));
      }

      const savedHistory = localStorage.getItem('aporiatrace_verification_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      setActiveTab('screener');
    }
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('aporiatrace_auth_user', JSON.stringify(user));
    setActiveTab('screener');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('aporiatrace_auth_user');
    setActiveTab('auth');
    setAuthMode('signin');
  };

  const saveToHistory = (res: VerificationResult) => {
    const updated = [res, ...history.filter(h => h.candidate.email !== res.candidate.email)].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem('aporiatrace_verification_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleVerify = async (input: CandidateInput) => {
    setIsLoading(true);
    setError(null);
    setCurrentStepText('Analyzing email validity, MX records & domain reputation...');

    const stepInterval = setInterval(() => {
      setCurrentStepText((prev) => {
        if (prev.includes('email validity')) return 'Resolving cross-platform aliases & social handles (GitHub, X, LinkedIn)...';
        if (prev.includes('Resolving cross-platform')) return 'Mining publicly documented affiliations, events, hackathons & conferences...';
        if (prev.includes('Mining publicly documented')) return 'Cataloging public projects, publications & patent disclosures...';
        if (prev.includes('Cataloging public projects')) return 'Constructing topological relationship graph & chronological activity timeline...';
        if (prev.includes('Constructing topological')) return 'Performing anti-fraud ambiguity & conflict detection with evidence trails...';
        return 'Finalizing AporiaTrace Intelligence Dossier...';
      });
    }, 1100);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to complete identity verification.');
      }

      const data: VerificationResult = await response.json();
      setCurrentResult(data);
      saveToHistory(data);

      setTimeout(() => {
        const reportElement = document.getElementById('verification-report-container');
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Verification failure:', err);
      setError(err.message || 'An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Command Center Header */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Operational Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-900/30 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  AporiaTrace
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ENTERPRISE OSINT & IDENTITY ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multi-Source Cyber Identity Verification & Public Footprint Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('screener')}
                id="tab-screener"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'screener'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Live Screener</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                id="tab-guide"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'guide'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Methodology & Rubric</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                id="tab-history"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Logs</span>
                {history.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 text-[10px] flex items-center justify-center font-bold border border-blue-400/30">
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('auth')}
                id="tab-auth"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'auth'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Officer Clearance</span>
              </button>
            </nav>

            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-blue-400 font-semibold">{currentUser.clearanceLevel.replace(/_/g, ' ')}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out Session"
                  className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Loading Overlay / Progress Stepper Banner */}
        {isLoading && (
          <div className="p-6 bg-slate-800/80 border border-blue-500/30 rounded-2xl shadow-xl text-center backdrop-blur-md animate-pulse">
            <div className="w-12 h-12 border-3 border-blue-500/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Executing AporiaTrace Multi-Signal Footprint Intelligence Pipeline...
            </h3>
            <p className="text-xs font-medium text-blue-400 font-mono">
              {currentStepText}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-white">Investigation Notice</p>
              <p className="text-xs text-rose-300">{error}</p>
            </div>
          </div>
        )}

        {/* Tab 1: Live Candidate Screener */}
        {activeTab === 'screener' && (
          <div className="space-y-8">
            {/* Command Center Telemetry Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Live Intelligence Command Center</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    AI-Powered Cyber Identity & OSINT Corroboration Engine
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Correlates consented images and identity fragments across 12+ public ecosystems, resolves disparate aliases, detects deceptive fraud signals, and constructs an interactive topological relationship graph.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sources Scanned</span>
                    <span className="text-sm font-black text-white">12+ Public Platforms</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Biometric Sync</span>
                    <span className="text-sm font-black text-emerald-400">Avatar Landmark Match</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fraud Prevention</span>
                    <span className="text-sm font-black text-blue-400">Collision Damping</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Legal Protocol</span>
                    <span className="text-sm font-black text-amber-400">Consented & Ethical</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Intake Form */}
            <CandidateForm onVerify={handleVerify} isLoading={isLoading} />

            {/* Results Dossier */}
            {currentResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-blue-400" />
                    <span>AporiaTrace Intelligence Dossier</span>
                  </h3>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Scan Another Candidate ↑
                  </button>
                </div>
                <VerificationResults result={currentResult} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Step-by-Step Architecture Guide & Evaluator Rubric */}
        {activeTab === 'guide' && (
          <MethodologyGuide />
        )}

        {/* Tab 3: Screening Audit History */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Digital Footprint Audit History
                </h2>
                <p className="text-xs text-slate-400">
                  Recent candidate intelligence reports generated in this active session
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.removeItem('aporiatrace_verification_history');
                    setHistory([]);
                  }}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-900/60 hover:bg-rose-950/30 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentResult(item);
                      setActiveTab('screener');
                    }}
                    className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm hover:border-blue-500/50 hover:shadow-blue-900/10 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {item.candidate.photoPreview ? (
                          <img
                            src={item.candidate.photoPreview}
                            alt={item.candidate.fullName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                            {item.candidate.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {item.candidate.fullName}
                          </h4>
                          <p className="text-xs text-slate-400">{item.candidate.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                          item.trustLevel === 'VERIFIED' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' :
                          item.trustLevel === 'MODERATE_CONFIDENCE' ? 'bg-blue-950/80 text-blue-400 border-blue-800' :
                          'bg-rose-950/80 text-rose-400 border-rose-800'
                        }`}>
                          Score: {item.overallTrustScore}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 line-clamp-2 mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      {item.executiveSummary}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                      <span>{new Date(item.verificationTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-blue-400 font-semibold hover:underline flex items-center gap-1">
                        View Dossier →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
                <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">No Audit Records Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Run a candidate verification from the Live Screener tab to build your session dossier history.
                </p>
                <button
                  onClick={() => setActiveTab('screener')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                >
                  Start First Investigation
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Investigator Auth & Officer Clearance Profile */}
        {activeTab === 'auth' && (
          <AuthPage
            currentUser={currentUser}
            initialMode={authMode}
            onAuthSuccess={handleAuthSuccess}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* Auth Modal popup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Global Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span><strong>AporiaTrace Intelligence Core</strong> · Enterprise Cyber Identity & Multi-Source OSINT Verification Platform</span>
          </div>
          <div>
            Consented & Authorized OSINT Profile Intelligence Pipeline · Zero Private Breach Ingestion
          </div>
        </div>
      </footer>
    </div>
  );
}
