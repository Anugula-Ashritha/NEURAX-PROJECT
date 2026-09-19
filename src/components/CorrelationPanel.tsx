import React from 'react';
import { 
  GitMerge, 
  Link2, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { CorrelationSignal, ConfidenceLevel } from '../types.ts';

interface CorrelationPanelProps {
  correlations: CorrelationSignal[];
}

export const CorrelationPanel: React.FC<CorrelationPanelProps> = ({ correlations }) => {
  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGH':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-900/60';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/50 border-amber-900/60';
      case 'LOW':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      case 'CONFLICTING':
        return 'text-rose-400 bg-rose-950/50 border-rose-900/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cross-Platform Identity Correlation
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explainable heuristic signals linking fragmented public accounts to a unified digital identity.
            </p>
          </div>
        </div>
      </div>

      {correlations.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800/80 text-center text-slate-500">
          <p className="text-sm">No cross-platform correlation signals recorded for this target identity.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {correlations.map((signal) => (
            <div
              key={signal.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 font-mono text-xs font-semibold">
                      {signal.type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadge(signal.confidence)}`}>
                    {signal.confidence} CONFIDENCE
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">
                  {signal.description}
                </h3>

                {/* Platforms Involved */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="text-[11px] font-mono text-slate-500 mr-1">Platforms:</span>
                  {signal.platformsInvolved.map((p, i) => (
                    <span key={i} className="text-xs font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {p}
                    </span>
                  ))}
                </div>

                {/* Evidence narrative */}
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900 mb-3">
                  <strong className="text-slate-300 font-mono block text-[10px] uppercase mb-0.5">Corroborating Evidence:</strong>
                  {signal.evidence}
                </p>
              </div>

              {/* Source Links */}
              {signal.sourceUrls && signal.sourceUrls.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
                    VERIFIED PUBLIC SOURCES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {signal.sourceUrls.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/40 px-2.5 py-1 rounded-lg border border-blue-900/50 transition-colors"
                      >
                        <span>{link.label || 'View Source'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
