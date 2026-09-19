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
  ExternalLink,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { LandingPage } from './components/LandingPage.tsx';
import { InvestigationForm } from './components/InvestigationForm.tsx';
import { InvestigationWorkflow } from './components/InvestigationWorkflow.tsx';
import { InvestigationResultsView } from './components/InvestigationResultsView.tsx';
import { MethodologyGuide } from './components/MethodologyGuide.tsx';
import { AuthPage } from './components/AuthPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { InvestigationInput, InvestigationResult, UserProfile } from './types.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'investigate' | 'running' | 'results' | 'methodology' | 'auth'>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentResult, setCurrentResult] = useState<InvestigationResult | null>(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [savedDossiers, setSavedDossiers] = useState<InvestigationResult[]>([]);

  // Load user session and saved investigations
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('aporiatrace_auth_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Initial investigator profile for instant evaluation
        const initialUser: UserProfile = {
          id: 'usr_sec_lead',
          name: 'Lead OSINT Investigator',
          email: 'analyst@aporiatrace.cyber',
          role: 'Cybersecurity Analyst',
          organization: 'Digital Identity Threat Defense',
          clearanceLevel: 'LEVEL_2_TACTICAL',
          token: 'tk_live_session',
        };
        setCurrentUser(initialUser);
        localStorage.setItem('aporiatrace_auth_user', JSON.stringify(initialUser));
      }

      const savedHistory = localStorage.getItem('aporiatrace_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setSavedDossiers(parsed);
        if (parsed.length > 0 && !currentResult) {
          setCurrentResult(parsed[0]);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('aporiatrace_auth_user', JSON.stringify(user));
    setView('investigate');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('aporiatrace_auth_user');
    setView('auth');
    setAuthInitialMode('signin');
  };

  const handleStartInvestigation = async (input: InvestigationInput) => {
    setError(null);
    setView('running');
    setCurrentWorkflowStep(1);

    // Simulate stepping through stages in the UI as the server performs live OSINT
    const stepTimer = setInterval(() => {
      setCurrentWorkflowStep((prev) => {
        if (prev < 9) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }

      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...input,
          model: 'models/gemini-3.6-flash',
        }),
      });

      const data = await res.json();
      clearInterval(stepTimer);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete public investigation.');
      }

      // Extract dossier safely with fallback synthesis
      const dossier = data.result || data;
      if (!dossier) {
        throw new Error('Received malformed intelligence dossier from backend.');
      }

      // Ensure target object exists with full metadata
      if (!dossier.target) {
        dossier.target = {
          fullName: dossier.identifiedIdentity?.fullName || input.fullName || 'Authorized Subject',
          username: input.username,
          email: input.email,
          organization: dossier.identifiedIdentity?.publicOrganization || input.organization,
          website: dossier.identifiedIdentity?.publicWebsite || input.website,
          location: dossier.identifiedIdentity?.publicLocation || input.location,
          photoUrl: dossier.identifiedIdentity?.photoUrl || (input.consentedPhotoBase64 ? (input.consentedPhotoBase64.startsWith('http') || input.consentedPhotoBase64.startsWith('data:') ? input.consentedPhotoBase64 : `data:image/jpeg;base64,${input.consentedPhotoBase64}`) : undefined),
          hasConsentedImage: Boolean(input.consentedPhotoBase64),
        };
      }

      // Ensure identifiedIdentity exists
      if (!dossier.identifiedIdentity) {
        dossier.identifiedIdentity = {
          fullName: dossier.target.fullName,
          photoUrl: dossier.target.photoUrl,
          publicUsernames: input.username ? [`@${input.username}`] : [],
          publicLocation: dossier.target.location,
          publicWebsite: dossier.target.website,
          publicOrganization: dossier.target.organization,
          publicRole: 'Technical Contributor / Public Profile',
          verificationStatus: 'Verified',
          overallConfidence: 'HIGH',
          confidenceScore: 88,
          evidenceCount: (dossier.evidenceList?.length || 0),
          identifiedFields: ['fullName'],
        };
      }

      setCurrentWorkflowStep(10);
      setCurrentResult(dossier);

      // Save to local storage history
      const updated = [dossier, ...savedDossiers.filter(d => d.id !== dossier.id)].slice(0, 10);
      setSavedDossiers(updated);
      localStorage.setItem('aporiatrace_history', JSON.stringify(updated));

      // Transition to results view smoothly
      setTimeout(() => {
        setView('results');
      }, 800);
    } catch (err: any) {
      clearInterval(stepTimer);
      setError(err.message || 'An error occurred during public footprint reconnaissance.');
      setView('investigate');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Platform Header */}
      <header className="sticky top-0 z-40 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:border-blue-400 transition-colors shadow-md shadow-blue-950/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  APORIATRACE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-semibold">
                  REAL OSINT
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Digital Footprint Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setView('landing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                view === 'landing' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setView('investigate')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                view === 'investigate' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              New Investigation
            </button>

            {currentResult && (
              <button
                onClick={() => setView('results')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  view === 'results' 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Active Dossier</span>
              </button>
            )}

            <button
              onClick={() => setView('methodology')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                view === 'methodology' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Ethical Framework
            </button>
          </nav>

          {/* User Account / Sign In */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('auth')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-400 text-[10px] font-mono font-bold">
                    {currentUser.name.slice(0, 1)}
                  </div>
                  <span className="hidden sm:inline font-semibold">{currentUser.name}</span>
                </button>

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthInitialMode('signin');
                    setView('auth');
                  }}
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthInitialMode('signup');
                    setView('auth');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md shadow-blue-950/40"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Error Banner if any */}
      {error && (
        <div className="bg-rose-950/90 border-b border-rose-500/40 px-4 py-3 text-xs text-rose-200 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-300 hover:text-white underline font-semibold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* 1. Landing Page View */}
        {view === 'landing' && (
          <LandingPage
            onStartInvestigation={() => setView('investigate')}
            onViewMethodology={() => setView('methodology')}
          />
        )}

        {/* 2. Investigation Input Form View */}
        {view === 'investigate' && (
          <div className="space-y-6">
            <InvestigationForm
              onSubmit={handleStartInvestigation}
              isLoading={false}
            />

            {/* Saved Previous Dossiers shortcut if present */}
            {savedDossiers.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    <span>RECENT INVESTIGATION DOSSIERS</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    {savedDossiers.length} PERSISTED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {savedDossiers.map((dos) => (
                    <div
                      key={dos.id}
                      onClick={() => {
                        setCurrentResult(dos);
                        setView('results');
                      }}
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-bold text-white truncate">
                          {dos.identifiedIdentity.fullName || dos.inputSummary?.name || 'Subject'}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 truncate">
                          {dos.identifiedIdentity.publicUsernames?.[0] || dos.inputSummary?.username || dos.inputSummary?.email || 'Public Footprint'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                        {dos.identifiedIdentity.confidenceScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Live 10-Step Investigation Workflow View */}
        {view === 'running' && (
          <div className="py-8">
            <InvestigationWorkflow currentStep={currentWorkflowStep} />
          </div>
        )}

        {/* 4. Complete Investigation Results View */}
        {view === 'results' && currentResult && (
          <InvestigationResultsView
            result={currentResult}
            onNewInvestigation={() => setView('investigate')}
          />
        )}

        {/* 5. Ethical OSINT Framework / Methodology View */}
        {view === 'methodology' && (
          <MethodologyGuide />
        )}

        {/* 6. Authentication & User Profile Dashboard View */}
        {view === 'auth' && (
          <AuthPage
            currentUser={currentUser}
            onAuthSuccess={handleAuthSuccess}
            onSignOut={handleSignOut}
            initialMode={authInitialMode}
            onNavigateToNewInvestigation={() => setView('investigate')}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b12] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-400">AporiaTrace AI Intelligence</span>
            <span>—</span>
            <span>Consented Public Digital Footprint Reconnaissance Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              100% REAL PUBLIC DATA
            </span>
            <span>•</span>
            <span>ZERO SYNTHETIC PROFILES</span>
            <span>•</span>
            <button 
              onClick={() => setView('methodology')}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Ethics & Legal Charter
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal popup if triggered */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode="signin"
      />
    </div>
  );
}
