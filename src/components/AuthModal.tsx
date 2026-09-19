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
  X, 
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signup'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'OSINT Investigator' | 'Cybersecurity Analyst' | 'Senior Intelligence Director' | 'Identity Screening Officer'>('OSINT Investigator');
  const [organization, setOrganization] = useState('Enterprise Cyber Defense Lab');
  const [agreedToCharter, setAgreedToCharter] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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

      setSuccessMessage(mode === 'signup' ? 'Account created! Initializing clearance credentials...' : 'Session verified.');
      localStorage.setItem('aporiatrace_auth_user', JSON.stringify(data.user));
      
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      // If server error or offline fallback
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
        onClose();
      } else {
        setErrorMessage(err.message || 'Authentication error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-400/40 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white tracking-wide">
                  AporiaTrace
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 border border-blue-400/30 text-blue-300">
                  ENTERPRISE OSINT
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Public Profile & Digital Footprint Intelligence Portal
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3">
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
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
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              mode === 'signin'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In (Existing Analyst)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Investigator Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cybersecurity Role
                    </label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Enterprise Cyber Defense Lab"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToCharter}
                    onChange={(e) => setAgreedToCharter(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed">
                    I acknowledge that all investigations conducted in <strong>AporiaTrace</strong> rely strictly on organizer-approved, consented, or public information. No credential bypassing or unauthorized breaches.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Credentials...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create AporiaTrace Account' : 'Authenticate Session'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          AporiaTrace Intelligence Engine • Ethical Cyber Identity & Public Footprint Telemetry
        </div>
      </div>
    </div>
  );
};
