import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Shield,
  FileCheck2,
  Database,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onSignOut: () => void;
  initialMode?: 'signup' | 'signin';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onAuthSuccess,
  onSignOut,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'OSINT Investigator' | 'Cybersecurity Analyst' | 'Senior Intelligence Director' | 'Identity Screening Officer'>('OSINT Investigator');
  const [organization, setOrganization] = useState('Enterprise Cyber Defense Lab');
  const [agreedToCharter, setAgreedToCharter] = useState(true);

  // Sync mode if initialMode prop updates
  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Full name is required for investigator identity auditing.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreedToCharter) {
        setErrorMessage('You must acknowledge the Ethical OSINT & Consented Intelligence Charter.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload = mode === 'signup' 
        ? { name, email, password, role, organization }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setSuccessMessage(mode === 'signup' ? 'Investigator account created successfully!' : 'Session authenticated.');
      localStorage.setItem('aporiatrace_auth_user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err: any) {
      if (mode === 'signup') {
        const clientUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          role,
          organization: organization.trim() || 'Independent CyberSec Unit',
          clearanceLevel: role === 'Senior Intelligence Director' ? 'LEVEL_3_DIRECTOR' : 'LEVEL_2_TACTICAL',
          token: `tk_client_${Date.now()}`,
        };
        localStorage.setItem('aporiatrace_auth_user', JSON.stringify(clientUser));
        onAuthSuccess(clientUser);
      } else {
        setErrorMessage(err.message || 'Authentication error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, show Profile / Session Card
  if (currentUser) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 border-2 border-blue-400/40 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    SESSION ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">{currentUser.organization}</p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors shadow-2xs"
            >
              Sign Out Session
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Security Role
              </span>
              <p className="text-sm font-bold text-slate-900">{currentUser.role}</p>
              <p className="text-xs text-slate-500 mt-1">Authorized for Enterprise Multi-Source Public Footprint Telemetry</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Clearance Level
              </span>
              <p className="text-sm font-bold text-blue-700">{currentUser.clearanceLevel.replace(/_/g, ' ')}</p>
              <p className="text-xs text-slate-500 mt-1">Full access to Relationship Graph, Aliases & Patents</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Compliance Protocol
              </span>
              <p className="text-sm font-bold text-emerald-700">Consented & Authorized</p>
              <p className="text-xs text-slate-500 mt-1">Zero bypass / No unauthorized breach data</p>
            </div>
          </div>
        </div>

        {/* Investigator Security Privileges Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AporiaTrace Operational Capabilities</h3>
              <p className="text-xs text-blue-200">Active features unlocked under your investigator clearance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200 pt-2">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-2.5">
              <Fingerprint className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Cross-Platform Alias Resolution</p>
                <p className="text-slate-300 text-[11px]">Correlates disparate handles across GitHub, X, LinkedIn, Devpost, and YouTube with evidence trails.</p>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Interactive Relationship Graph</p>
                <p className="text-slate-300 text-[11px]">Visual topology connecting verified entities, corporate affiliations, code repos, and hackathon milestones.</p>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-2.5">
              <FileCheck2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Chronological Activity Timeline</p>
                <p className="text-slate-300 text-[11px]">Reconstructs the subject's career journey, talks, publications, and patents with source citations.</p>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Ambiguity & Conflict Detection</p>
                <p className="text-slate-300 text-[11px]">Surfaces conflicting metadata, suspicious throwaway inboxes, and provides verification guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated: Show full Sign Up / Sign In Page
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>ENTERPRISE CYBER DEFENSE · ETHICAL IDENTITY INTELLIGENCE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AporiaTrace Investigator Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Create an investigator account or sign in to discover, correlate, and verify fragmented public identities with evidentiary trails.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toggle bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-4">
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`pb-3 px-5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              mode === 'signup'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sign Up (New Investigator)</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`pb-3 px-5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              mode === 'signin'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In (Existing Analyst)</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Investigator Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cybersecurity Specialty
                    </label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="OSINT Investigator">OSINT Investigator</option>
                      <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                      <option value="Senior Intelligence Director">Senior Intelligence Director</option>
                      <option value="Identity Screening Officer">Identity Screening Officer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization / Team
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Enterprise Cyber Defense Lab"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToCharter}
                    onChange={(e) => setAgreedToCharter(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to the <strong>AporiaTrace Ethical OSINT & Authorized Intelligence Charter</strong>: all telemetry will be limited strictly to consented, organizer-approved public or synthetic datasets.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Intelligence Clearance...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Complete Sign Up & Provision Clearance' : 'Authenticate Session'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Mode Switch Helper Link */}
            <div className="text-center pt-2">
              {mode === 'signup' ? (
                <p className="text-xs text-slate-500">
                  Already registered as an investigator?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMessage(null); }}
                    className="font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    Sign In to existing session
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  New to AporiaTrace?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(null); }}
                    className="font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    Create an investigator account & get clearance
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
