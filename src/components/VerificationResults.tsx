import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  XCircle,
} from 'lucide-react';
import { VerificationResult } from '../types';
import { NetworkGraph } from './NetworkGraph';

interface VerificationResultsProps {
  result: VerificationResult;
}

const statusStyle: Record<string, string> = {
  verified_match: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  candidate_match: 'bg-blue-100 text-blue-800 border-blue-200',
  no_result: 'bg-slate-100 text-slate-700 border-slate-200',
  source_unavailable: 'bg-amber-100 text-amber-800 border-amber-200',
};

const trustBadge = (trustLevel: VerificationResult['trustLevel']) => {
  if (trustLevel === 'VERIFIED') return { label: 'VERIFIED', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (trustLevel === 'MODERATE_CONFIDENCE') return { label: 'MODERATE', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800 border-blue-300' };
  if (trustLevel === 'UNVERIFIED_RISK') return { label: 'HIGH RISK', icon: <ShieldX className="w-4 h-4" />, color: 'bg-rose-100 text-rose-800 border-rose-300' };
  return { label: 'INSUFFICIENT SIGNALS', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-amber-100 text-amber-800 border-amber-300' };
};

const toProfileEntries = (result: VerificationResult) => {
  const profiles = Object.entries(result.socialProfiles)
    .filter(([key]) => key !== 'gravatar')
    .map(([platform, value]) => {
      if (platform === 'github') {
        const github = value as any;
        return {
          platform,
          label: 'GitHub',
          status: github.status || (github.found ? 'verified_match' : 'no_result'),
          url: github.html_url || (result.candidate.githubUsername ? `https://github.com/${result.candidate.githubUsername}` : undefined),
          detail: github.found ? `@${github.login || 'unknown'} · ${github.public_repos || 0} repos` : 'No matched GitHub profile.',
        };
      }

      const profile = value as any;
      return {
        platform,
        label: platform,
        status: profile.status || 'no_result',
        url: profile.inferredUrl || profile.searchUrl,
        detail: profile.inferredHandle ? `Handle: ${profile.inferredHandle}` : 'No confirmed handle.',
      };
    });

  return profiles;
};

export const VerificationResults: React.FC<VerificationResultsProps> = ({ result }) => {
  const badge = trustBadge(result.trustLevel);
  const profiles = toProfileEntries(result);
  const findings = result.evidenceMatrix || [];
  const conflicts = result.conflictsAndAmbiguities || [];

  return (
    <div id="verification-report-container" className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            {result.candidate.photoPreview ? (
              <img src={result.candidate.photoPreview} alt={result.candidate.fullName} className="w-20 h-20 rounded-xl object-cover border" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-slate-100 border flex items-center justify-center text-xl font-bold text-slate-500">
                {result.candidate.fullName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900">{result.candidate.fullName}</h2>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1"><Mail className="w-4 h-4" />{result.candidate.email}</p>
              <p className="text-xs text-slate-500 mt-1">{result.currentActivity.titleRole || 'No role confirmed'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-semibold text-slate-500">Trust Score</p>
            <p className="text-4xl font-black text-slate-900">{result.overallTrustScore}<span className="text-sm text-slate-500">/100</span></p>
            <p className="text-xs text-slate-500 flex items-center justify-end gap-1"><Clock className="w-3 h-3" />{new Date(result.verificationTimestamp).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-sm text-slate-800">{result.executiveSummary}</p>
        </div>
      </div>

      {result.relationshipGraph && <NetworkGraph graph={result.relationshipGraph} subjectName={result.candidate.fullName} photoUrl={result.candidate.photoPreview} />}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4"><Globe className="w-5 h-5 text-cyan-600" />Source Profile Coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {profiles.map((profile) => (
            <div key={profile.platform} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 text-sm capitalize">{profile.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle[profile.status] || statusStyle.no_result}`}>
                  {profile.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600">{profile.detail}</p>
              {profile.url ? (
                <a href={profile.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  Open Source Link <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-xs text-slate-500">No URL available.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Evidence Matrix</h3>
        {findings.length > 0 ? (
          <div className="space-y-2">
            {findings.map((item, index) => (
              <div key={`${item.claim}-${index}`} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.claim}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">{item.confidence}%</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Sources: {item.supportingSources.join(', ') || 'none'}</p>
                <div className="flex gap-2 mt-2">
                  {item.conflict && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">Conflict</span>}
                  {item.uncertainty && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Uncertain</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No evidence findings were extracted from the available sources.</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Timeline</h3>
        {result.activityTimeline && result.activityTimeline.length > 0 ? (
          <div className="space-y-2">
            {result.activityTimeline.map((item, index) => (
              <div key={item.id || index} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{item.yearOrDate || item.year || 'Undated'}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                <p className="text-[11px] text-slate-500 mt-1">{item.category} · {item.source}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No timeline events were extracted.</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Conflicts & Uncertainty</h3>
        {conflicts.length > 0 ? (
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div key={`${conflict.title}-${index}`} className="p-3 rounded-xl border border-amber-200 bg-amber-50">
                <p className="text-sm font-semibold text-amber-900">{conflict.title}</p>
                <p className="text-xs text-amber-800 mt-1">{conflict.description}</p>
                <p className="text-xs text-amber-700 mt-1">Guidance: {conflict.investigationGuidance}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No explicit conflicts detected from currently available evidence.</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Risk Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.riskSignals.map((signal, index) => (
            <div
              key={`${signal.title}-${index}`}
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                signal.type === 'positive'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : signal.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {signal.type === 'positive' && <CheckCircle2 className="w-4 h-4 mt-0.5" />}
              {signal.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5" />}
              {signal.type === 'negative' && <XCircle className="w-4 h-4 mt-0.5" />}
              <div>
                <p className="text-sm font-semibold">{signal.title}</p>
                <p className="text-xs">{signal.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
