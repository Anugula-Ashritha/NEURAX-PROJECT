import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, BarChart3 } from 'lucide-react';
import { ConfidenceExplanation } from '../types.ts';

interface ConfidenceModalProps {
  explanation: ConfidenceExplanation;
  onClose: () => void;
  isOpen?: boolean;
  subjectName?: string;
}

export const ConfidenceModal: React.FC<ConfidenceModalProps> = ({
  explanation,
  onClose,
  isOpen = true,
  subjectName,
}) => {
  if (!isOpen) return null;

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/50';
      case 'LOW':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'CONFLICTING':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/50';
      default:
        return 'bg-blue-950 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Confidence & Evidence Calculation
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explainable algorithmic confidence score derived from verified public sources.
            </p>
          </div>
        </div>

        {/* Overall Score Badge */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              AGGREGATE METRIC SCORE
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{explanation.overallScore}</span>
              <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border text-sm font-bold font-mono tracking-wider ${getBadgeStyle(explanation.level)}`}>
            {explanation.level} CONFIDENCE
          </div>
        </div>

        {/* Summary Description */}
        <div className="mb-6 p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-sm text-slate-300 leading-relaxed">
          <p className="font-semibold text-blue-400 text-xs uppercase font-mono mb-1">
            METHODOLOGY SUMMARY
          </p>
          {explanation.summary}
        </div>

        {/* Signals Breakdown Table */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            CONTRIBUTING CORRELATION SIGNALS
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {explanation.signals.map((signal, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {signal.impact === 'STRONG_POSITIVE' || signal.impact === 'POSITIVE' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : signal.impact === 'WARNING' || signal.impact === 'NEGATIVE' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {signal.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {signal.description}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/40">
                      {signal.verifiedSourcesCount} verified source{signal.verifiedSourcesCount === 1 ? '' : 's'} checked
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                    signal.impact.includes('POSITIVE')
                      ? 'text-emerald-400 bg-emerald-950/40' 
                      : 'text-amber-400 bg-amber-950/40'
                  }`}>
                    {signal.scoreContribution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
