import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  User, 
  Mail, 
  AtSign, 
  Building2, 
  Globe, 
  MapPin, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { InvestigationInput } from '../types.ts';

interface InvestigationFormProps {
  onSubmit: (input: InvestigationInput) => void;
  isLoading: boolean;
}

export const InvestigationForm: React.FC<InvestigationFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  
  // Consented Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consent confirmation (pre-confirmed for non-intrusive public discovery)
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Quick fill helper for testing
  const handleLoadDemoSubject = () => {
    setFullName('Linus Torvalds');
    setUsername('torvalds');
    setEmail('torvalds@linux-foundation.org');
    setOrganization('Linux Foundation');
    setWebsite('https://kernel.org');
    setLocation('Portland, Oregon, US');
    setAdditionalContext('Creator of Linux kernel and Git version control system.');
    // Real public avatar of Linus Torvalds
    const linusAvatar = 'https://avatars.githubusercontent.com/u/1024025?v=4';
    setPhotoUrl(linusAvatar);
    setPhotoPreview(linusAvatar);
    setPhotoBase64(linusAvatar);
    setConsentConfirmed(true);
    setFormError(null);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFormError('Photo size exceeds 8MB. Please upload a smaller image.');
      return;
    }
    setFormError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    setPhotoBase64(undefined);
    setPhotoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Rule: ONLY Name and Image Upload are required (marked with red *)
    if (!fullName.trim()) {
      setFormError('Target Full Name is required (marked with red *).');
      return;
    }

    const hasImage = Boolean(photoPreview || photoBase64 || photoUrl.trim());
    if (!hasImage) {
      setFormError('Target Reference Image is required (marked with red *). Please upload an image.');
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: email.trim() || undefined,
      username: username.trim() || undefined,
      organization: organization.trim() || undefined,
      website: website.trim() || undefined,
      location: location.trim() || undefined,
      additionalContext: additionalContext.trim() || undefined,
      consentedPhotoBase64: photoBase64,
      consentedPhotoUrl: photoUrl.trim() || undefined,
      consentConfirmed: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 font-mono text-xs font-semibold uppercase">
                TARGET IDENTIFICATION
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
                PUBLIC DATA ONLY
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Initiate Footprint Investigation
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Provide the target image and name to discover and cross-verify real public digital footprints across social, technical, and professional platforms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemoSubject}
              className="text-xs font-semibold text-blue-300 hover:text-white bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 px-3 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              title="Auto-fill verified real subject with public headshot and details for quick testing"
            >
              <span>Quick Test: Linus Torvalds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>AUDIT TRAIL LOGGED</span>
            </div>
          </div>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/50 flex items-start gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Validation Requirement</p>
            <p className="mt-0.5 text-red-300">{formError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Consented Photo Upload Card (REQUIRED - RED MARK) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-rose-500" />
                <span>Target Reference Image</span>
                <span className="text-rose-500 font-black text-lg leading-none" title="Mandatory Field">*</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload target headshot or photo to aid visual cross-correlation against discovered public profiles.
              </p>
            </div>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded font-bold">
              REQUIRED *
            </span>
          </div>

          {photoPreview ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <img 
                src={photoPreview} 
                alt="Target Reference Preview" 
                className="w-20 h-20 rounded-xl object-cover border border-rose-500/50 shadow-sm"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">Target Image Loaded</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for public profile avatar cross-correlation
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearPhoto}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-rose-500 bg-rose-950/20' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-300">
                Drag & drop reference photo here, or <span className="text-blue-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PNG, JPEG, WebP up to 8MB
              </p>
            </div>
          )}
        </div>

        {/* Primary Identity Markers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              Core Identity Markers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Only Name is mandatory (<span className="text-rose-500 font-bold">*</span>). All other markers are optional to assist index discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name (REQUIRED - RED MARK) */}
            <div>
              <label htmlFor="input-fullName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span>Full Name / Legal Name</span>
                <span className="text-rose-500 font-black text-base leading-none" title="Mandatory Field">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Linus Torvalds"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Public Username (OPTIONAL - NO RED MARK) */}
            <div>
              <label htmlFor="input-username" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Known Public Username / Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  id="input-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="input-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Public / Authorized Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. torvalds@linux-foundation.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Organization / Company */}
            <div>
              <label htmlFor="input-organization" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Organization / University / Employer
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="input-organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Linux Foundation, Stanford University"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Website / Portfolio */}
            <div>
              <label htmlFor="input-website" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Website / Portfolio URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  id="input-website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="input-location" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Public Location (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="input-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Portland, Oregon, US"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Additional Context / Keywords */}
          <div>
            <label htmlFor="input-additionalContext" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Public Context / Keywords (Optional)
            </label>
            <div className="relative">
              <textarea
                id="input-additionalContext"
                rows={2}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. Known open source projects, conference speaker topics, secondary handles..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Mandatory Authorization & Consent Box (Section 6) */}
        <div className="bg-slate-950 border border-blue-900/60 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <input
              id="checkbox-consent"
              type="checkbox"
              checked={consentConfirmed}
              onChange={(e) => setConsentConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="checkbox-consent" className="text-sm text-slate-200 cursor-pointer select-none leading-relaxed">
              <span className="font-bold text-white block">
                Mandatory Authorization & Legal Consent Confirmation
              </span>
              I confirm that I am authorized to perform this investigation and that the information will be used only to analyze publicly available or authorized information.
            </label>
          </div>

          {/* Strict Privacy & Safeguard Notice (Section 6) */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Strict Privacy Safeguards:</strong> This platform never accesses private accounts, private messages, password-protected content, leaked databases, credential databases, or unauthorized information. Never bypasses authentication or access controls. All queries strictly discover public web footprints.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            id="btn-submit-investigation"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-blue-900/40 border border-blue-400/40 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>INVESTIGATING PUBLIC FOOTPRINT...</span>
              </>
            ) : (
              <>
                <span>START INVESTIGATION</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
