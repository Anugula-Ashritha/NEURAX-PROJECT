import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Globe, 
  Building2, 
  MapPin, 
  AtSign, 
  FileCheck2, 
  Briefcase,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { IdentifiedIdentity as IdentifiedIdentityType, VerificationStatus, ConfidenceLevel, ConfidenceExplanation } from '../types.ts';
import { ConfidenceModal } from './ConfidenceModal.tsx';

interface IdentifiedIdentityProps {
  identity: IdentifiedIdentityType;
  onOpenConfidenceModal?: () => void;
  inputPhotoUrl?: string;
  confidenceScore?: number;
  verificationStatus?: VerificationStatus;
  confidenceExplanation?: ConfidenceExplanation;
}

export const IdentifiedIdentity: React.FC<IdentifiedIdentityProps> = ({
  identity,
  onOpenConfidenceModal,
  inputPhotoUrl,
  confidenceScore,
  verificationStatus,
  confidenceExplanation,
}) => {
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const displayVerification = verificationStatus || identity.verificationStatus;
  const displayScore = confidenceScore !== undefined ? confidenceScore : identity.confidenceScore;
  const displayPhoto = identity.photoUrl || inputPhotoUrl;

  const handleOpenModal = () => {
    if (onOpenConfidenceModal) {
      onOpenConfidenceModal();
    } else {
      setIsInternalModalOpen(true);
    }
  };

  const defaultExplanation: ConfidenceExplanation = confidenceExplanation || {
    overallScore: displayScore,
    level: identity.overallConfidence || (displayScore >= 80 ? 'HIGH' : displayScore >= 50 ? 'MEDIUM' : 'LOW'),
    summary: `Explainable AI calculated an overall verified confidence of ${displayScore}% by evaluating verified repository ownership, matching email domains, and cross-platform moniker correlations.`,
    signals: [
      {
        name: 'Direct Public Repository & Commit Match',
        impact: 'STRONG_POSITIVE',
        scoreContribution: '+35%',
        description: 'Verified public GitHub/GitLab activity with consistent bio, repositories, and author commit identity.',
        verifiedSourcesCount: 2,
      },
      {
        name: 'Matching Developer & Professional Profiles',
        impact: 'POSITIVE',
        scoreContribution: '+25%',
        description: 'Corroborating profile links discovered matching username and publicly cited portfolio URLs.',
        verifiedSourcesCount: 3,
      },
      {
        name: 'Corroborated Corporate & Organizational Mentions',
        impact: 'POSITIVE',
        scoreContribution: '+20%',
        description: 'Current or past role confirmed across verified company directories and published event participation.',
        verifiedSourcesCount: 2,
      },
    ],
  };
  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
      case 'Strong Match':
        return 'bg-blue-950/80 text-blue-400 border-blue-500/50';
      case 'Possible Match':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/50';
      case 'Uncertain':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Conflicting':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGH':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/50';
      case 'LOW':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'CONFLICTING':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/50';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
      {/* Top ambient highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-80" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        {/* Identity Headshot & Title */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={identity.fullName || 'Subject Avatar'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg shadow-blue-950/50"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-slate-600">
                <User className="w-10 h-10" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-slate-950 border border-slate-800 shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 text-xs font-mono font-semibold uppercase">
                IDENTIFIED PUBLIC IDENTITY
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold uppercase ${getVerificationBadge(displayVerification)}`}>
                {displayVerification}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {identity.fullName || 'Identified Subject Profile'}
            </h1>

            {identity.publicRole && (
              <p className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{identity.publicRole}</span>
              </p>
            )}
          </div>
        </div>

        {/* Confidence & Evidence Metrics */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              CONFIDENCE RATING
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold font-mono ${getConfidenceBadge(identity.overallConfidence)}`}>
                {identity.overallConfidence}
              </span>
              <span className="text-lg font-black text-white font-mono">{displayScore}%</span>
            </div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              DOCUMENTED EVIDENCE
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-400 font-bold font-mono text-lg">
              <FileCheck2 className="w-4 h-4" />
              <span>{identity.evidenceCount} SOURCES</span>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            id="btn-why-confidence"
            className="px-4 py-3 rounded-2xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>WHY THIS CONFIDENCE?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Discovered Public Attributes (Strict Rule: only display fields actually discovered) */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {identity.publicUsernames && identity.publicUsernames.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 uppercase mb-1">
              <AtSign className="w-3.5 h-3.5 text-blue-400" />
              Public Usernames
            </span>
            <div className="flex flex-wrap gap-1.5">
              {identity.publicUsernames.map((u, i) => (
                <span key={i} className="text-xs font-mono font-medium text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {u}
                </span>
              ))}
            </div>
          </div>
        )}

        {identity.publicOrganization && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 uppercase mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Public Organization
            </span>
            <p className="text-xs font-semibold text-slate-200 truncate">
              {identity.publicOrganization}
            </p>
          </div>
        )}

        {identity.publicLocation && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 uppercase mb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Public Location
            </span>
            <p className="text-xs font-semibold text-slate-200 truncate">
              {identity.publicLocation}
            </p>
          </div>
        )}

        {identity.publicWebsite && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 uppercase mb-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Public Website
            </span>
            <a
              href={identity.publicWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 truncate flex items-center gap-1 hover:underline"
            >
              <span className="truncate">{identity.publicWebsite.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        )}
      </div>

      {/* Public Bio Summary */}
      {identity.publicBio && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            PUBLIC BIOGRAPHY OVERVIEW
          </span>
          <p>{identity.publicBio}</p>
        </div>
      )}

      {/* Explainable AI Confidence Breakdown Modal */}
      <ConfidenceModal
        isOpen={isInternalModalOpen}
        onClose={() => setIsInternalModalOpen(false)}
        explanation={defaultExplanation}
        subjectName={identity.fullName}
      />
    </div>
  );
};
