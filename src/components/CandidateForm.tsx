import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Camera,
  FileText,
  Fingerprint,
  Github,
  Linkedin,
  Mail,
  Search,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react';
import { CandidateInput } from '../types';

interface CandidateFormProps {
  onVerify: (input: CandidateInput) => Promise<void>;
  isLoading: boolean;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ onVerify, isLoading }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [knownAliases, setKnownAliases] = useState('');
  const [limitedContext, setLimitedContext] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setGithubUsername('');
    setLinkedinUrl('');
    setKnownAliases('');
    setLimitedContext('');
    setNotes('');
    setPhotoPreview(null);
    setConsentChecked(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return setError('Candidate Full Name is required.');
    if (!email.trim() || !email.includes('@')) return setError('A valid candidate email address is required.');
    if (!limitedContext.trim()) return setError('Limited context is required for real-source discovery.');
    if (!photoPreview) return setError('Consented candidate image is required.');
    if (!consentChecked) return setError('Organizer consent confirmation is required.');

    setError(null);

    await onVerify({
      fullName: fullName.trim(),
      email: email.trim(),
      githubUsername: githubUsername.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      knownAliases: knownAliases.trim() || undefined,
      limitedContext: limitedContext.trim(),
      notes: notes.trim() || undefined,
      organizerConsentAcknowledged: true,
      photoBase64: photoPreview,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-5 h-5 text-blue-300" />
          <div>
            <h3 className="text-sm sm:text-base font-bold">Candidate Identity Intake</h3>
            <p className="text-xs text-slate-300">Real-source only pipeline. No mock/demo fallback.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
        >
          Clear All
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-700">
                  Candidate Full Name *
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </label>

                <label className="block text-xs font-semibold text-slate-700">
                  Candidate Email *
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-700">
                  GitHub Handle (optional)
                  <div className="relative mt-1.5">
                    <Github className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </label>

                <label className="block text-xs font-semibold text-slate-700">
                  LinkedIn URL (optional)
                  <div className="relative mt-1.5">
                    <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </label>
              </div>

              <label className="block text-xs font-semibold text-slate-700">
                Known Aliases (comma separated)
                <textarea
                  rows={2}
                  value={knownAliases}
                  onChange={(e) => setKnownAliases(e.target.value)}
                  className="mt-1.5 w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </label>

              <label className="block text-xs font-semibold text-slate-700">
                Limited Context *
                <textarea
                  rows={3}
                  required
                  value={limitedContext}
                  onChange={(e) => setLimitedContext(e.target.value)}
                  className="mt-1.5 w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="Role, organization hints, technologies, public clues"
                />
              </label>

              <label className="block text-xs font-semibold text-slate-700">
                Additional Notes
                <div className="relative mt-1.5">
                  <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Consented Candidate Image *</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[180px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-2"
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Candidate" className="w-24 h-24 rounded-xl object-cover border" />
                    <span className="text-xs text-slate-600">Image ready</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-slate-500" />
                    <span className="text-xs text-slate-600">Upload image</span>
                  </>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove image
                </button>
              )}
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I confirm organizer-provided affirmative consent for this image and context, and authorize only approved public-source discovery.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Public-source only intelligence run. Synthetic fallback is disabled.</span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Running...</span>
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
        </form>
      </div>
    </div>
  );
};
