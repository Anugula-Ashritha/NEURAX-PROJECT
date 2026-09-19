import React, { useState } from 'react';
import { 
  FileCheck2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { EvidenceItem, ConfidenceLevel } from '../types.ts';

interface EvidencePanelProps {
  evidenceList: EvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidenceList }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const types = ['ALL', 'Social', 'Professional', 'Technical', 'Organization', 'Event', 'Publication'];

  const filtered = evidenceList.filter((item) => {
    const matchesType = filterType === 'ALL' || item.sourceType.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      item.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGH':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-900/60';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/60 border-amber-900/60';
      case 'LOW':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      case 'CONFLICTING':
        return 'text-rose-400 bg-rose-950/60 border-rose-900/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold uppercase">
              VERIFIED AUDIT LOG
            </span>
            <span className="text-xs font-mono text-slate-500">
              {evidenceList.length} DOCUMENTED FINDINGS
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Evidence & Public Verification Records
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every finding links directly to a verifiable public webpage, API response, or repository.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search evidence records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
              filterType === t
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Evidence Items List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500">
          <p className="text-sm">No evidence records match the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-400 font-semibold uppercase">
                    {item.sourceType}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Source: <strong className="text-slate-200">{item.source}</strong>
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadge(item.confidence)}`}>
                    {item.confidence}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40">
                    {item.verification}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">
                  {item.finding}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {item.evidence}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Verified on: {item.checkedAt}</span>
                </div>
              </div>

              {/* Open Source Button */}
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  <span>OPEN SOURCE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
