import React, { useState, useRef } from 'react';
import { 
  Search, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Sparkles, 
  Trash2, 
  Camera, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Scan,
  CheckCircle2,
  Zap,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { CandidateInput } from '../types';

interface CandidateFormProps {
  onVerify: (input: CandidateInput) => Promise<void>;
  isLoading: boolean;
}

interface PresetCandidate {
  id: string;
  name: string;
  email: string;
  github: string;
  linkedin: string;
  roleLabel: string;
  badge: string;
  badgeColor: string;
  tags: string[];
  notes: string;
  photoUrl: string;
}

const PRESET_CANDIDATES: PresetCandidate[] = [
  {
    id: 'torvalds',
    name: 'Linus Torvalds',
    email: 'torvalds@linux-foundation.org',
    github: 'torvalds',
    linkedin: '',
    roleLabel: 'Linux Kernel & Git Architect',
    badge: 'Verified Luminary',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tags: ['Kernel Architecture', 'C', 'Open Source'],
    notes: 'Creator of the Linux kernel and Git. Recipient of Millennium Technology Prize.',
    photoUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  },
  {
    id: 'rauchg',
    name: 'Guillermo Rauch',
    email: 'rauchg@gmail.com',
    github: 'rauchg',
    linkedin: 'https://www.linkedin.com/in/rauchg/',
    roleLabel: 'CEO & Founder at Vercel',
    badge: 'Executive Founder',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    tags: ['Next.js', 'Socket.io', 'Cloud Infrastructure'],
    notes: 'Creator of Next.js and Socket.io. Conference keynote speaker and cloud platform architect.',
    photoUrl: 'https://avatars.githubusercontent.com/u/13041?v=4',
  },
  {
    id: 'sec-lead',
    name: 'Dr. Sarah Vance',
    email: 'sarah.vance@cloudsec-lab.io',
    github: 'sarahvance-sec',
    linkedin: 'https://www.linkedin.com/in/sarah-vance-cyber',
    roleLabel: 'Principal Cybersecurity Researcher',
    badge: 'Infosec Lead',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    tags: ['Application Security', 'Zero Trust', 'Rust'],
    notes: 'Speaker at Black Hat and DEF CON. Published CVE-2024-8192 memory vulnerability researcher.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'phantom-test',
    name: 'Alex Mercer',
    email: 'temp_phantom99@mailinator.com',
    github: 'phantom-coder-99',
    linkedin: '',
    roleLabel: 'Unverified / Stealth Candidate',
    badge: 'Risk Damping Test',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    tags: ['Disposable Mail', 'No Footprint', 'Flagged'],
    notes: 'Submitted candidate with throwaway inbox. Testing anti-fraud collision & disposable email damping.',
    photoUrl: '',
  }
];

export const CandidateForm: React.FC<CandidateFormProps> = ({ onVerify, isLoading }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size should be less than 5MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please drop a valid image file.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: PresetCandidate) => {
    setActivePreset(preset.id);
    setFullName(preset.name);
    setEmail(preset.email);
    setGithubUsername(preset.github);
    setLinkedinUrl(preset.linkedin);
    setNotes(preset.notes);
    setPhotoPreview(preset.photoUrl || null);
    setError(null);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setGithubUsername('');
    setLinkedinUrl('');
    setNotes('');
    setPhotoPreview(null);
    setError(null);
    setActivePreset(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Candidate Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid candidate email address is required.');
      return;
    }

    setError(null);
    await onVerify({
      fullName: fullName.trim(),
      email: email.trim(),
      githubUsername: githubUsername.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      photoBase64: photoPreview || undefined,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Top Banner / Intake Telemetry */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-500/30">
            <Scan className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              Candidate Identity Intake & Telemetry
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE SENSORS
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Correlate consented credentials across 12+ public ecosystems, GitHub commits & biometrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            id="btn-clear-fields-top"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Preset Profiles Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Quick Test Candidate Archetypes (1-Click Autofill)</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Click any profile to load real OSINT demonstration data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_CANDIDATES.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-sm ring-1 ring-blue-400'
                      : 'bg-slate-50 hover:bg-white hover:border-slate-300 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    {preset.photoUrl ? (
                      <img
                        src={preset.photoUrl}
                        alt={preset.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-600 shrink-0">
                        {preset.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-xs text-slate-900 truncate">{preset.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{preset.roleLabel}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {preset.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Main Candidate Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Col 1 & 2: Primary Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Candidate Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="input-candidate-name"
                      required
                      placeholder="e.g. Linus Torvalds"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setActivePreset(null);
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Candidate Email <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="input-candidate-email"
                      required
                      placeholder="e.g. candidate@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setActivePreset(null);
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GitHub Handle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    GitHub Handle <span className="text-slate-400 font-normal">(Optional — auto-discovered if empty)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Github className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="input-candidate-github"
                      placeholder="e.g. torvalds or rauchg"
                      value={githubUsername}
                      onChange={(e) => {
                        setGithubUsername(e.target.value);
                        setActivePreset(null);
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    LinkedIn Profile URL <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="input-candidate-linkedin"
                      placeholder="e.g. https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => {
                        setLinkedinUrl(e.target.value);
                        setActivePreset(null);
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Notes / Stated Projects */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Interviewer Context & Claimed Accomplishments <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    id="input-candidate-notes"
                    rows={2}
                    placeholder="e.g. Candidate claims 6+ years in distributed systems, kernel development, or security vulnerability reporting."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setActivePreset(null);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Col 3: Candidate Photo / Biometric Reticle */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Consented Candidate Photograph / Bio Avatar
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all h-[215px] flex flex-col items-center justify-center ${
                  photoPreview
                    ? 'border-blue-400 bg-blue-50/30'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="file-candidate-photo"
                />

                {photoPreview ? (
                  <div className="relative group w-full h-full flex flex-col items-center justify-center">
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Candidate Preview"
                        className="w-24 h-24 object-cover rounded-2xl shadow-md border-2 border-white ring-2 ring-blue-500/30 mb-1"
                      />
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-xs text-blue-900 font-bold mt-1">Biometric Hash Ready</span>
                    <span className="text-[10px] text-slate-500">Cross-indexes Gravatar & GitHub avatars</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoPreview(null);
                        setActivePreset(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-1.5 text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold hover:underline"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-500">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-blue-600 hover:underline">Upload photo</span> or drag & drop
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-[180px] leading-tight mx-auto">
                      Cross-checks facial landmarks with public developer avatar hashes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ethical OSINT Architecture: Purely consented, public data with zero breach queries</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                id="btn-reset-form"
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                id="btn-submit-verify"
                disabled={isLoading}
                className="flex-1 sm:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Correlating Footprints...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Real-Time Identity Check</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
