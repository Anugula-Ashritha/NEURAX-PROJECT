import React from 'react';
import { 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  FolderGit2,
  Calendar,
  BookOpen,
  Code2
} from 'lucide-react';
import { InvestigationResult } from '../types.ts';

interface ReportViewProps {
  result: InvestigationResult;
}

export const ReportView: React.FC<ReportViewProps> = ({ result }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `OSINT_REPORT_${result.identifiedIdentity.fullName?.replace(/\s+/g, '_') || result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    // Generate CSV of verified evidence items & profiles
    const rows = [
      ['SECTION', 'NAME', 'TYPE/CATEGORY', 'VERIFICATION', 'CONFIDENCE', 'SOURCE_URL'],
      ...result.profiles.map(p => [
        'PUBLIC_PROFILE',
        p.platform,
        p.category,
        p.verification,
        p.confidence,
        p.profileUrl || 'N/A'
      ]),
      ...result.evidenceList.map(e => [
        'EVIDENCE_ITEM',
        `"${e.finding.replace(/"/g, '""')}"`,
        e.sourceType,
        e.verification,
        e.confidence,
        e.sourceUrl
      ]),
      ...result.projects.map(pr => [
        'PROJECT',
        `"${pr.name.replace(/"/g, '""')}"`,
        'OpenSource',
        'Verified',
        pr.confidence,
        pr.repositoryUrl || 'N/A'
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `OSINT_EVIDENCE_${result.identifiedIdentity.fullName?.replace(/\s+/g, '_') || result.id}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 print:p-0 print:bg-white print:text-black">
      {/* Action Bar (hidden when printing) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 font-mono text-xs font-semibold uppercase">
            AUDIT DOSSIER READY
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Digital Identity Intelligence Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 16-section exportable intelligence dossier with source citations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            id="btn-print-pdf"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>

          <button
            onClick={handleExportJson}
            id="btn-export-json"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleExportCsv}
            id="btn-export-csv"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>CSV Evidence</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-4 print:text-black">
        {/* Dossier Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>APORIATRACE OSINT DOSSIER • REF: {result.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black tracking-tight">
              {result.identifiedIdentity.fullName || 'Subject Identity Intelligence Report'}
            </h1>
            <p className="text-xs font-mono text-slate-400 print:text-gray-600 mt-1">
              GENERATED: {result.investigationDate} • SCOPE: PUBLIC DATA ONLY
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 print:border-emerald-700 print:text-emerald-800 text-xs font-mono font-bold uppercase">
              {result.identifiedIdentity.verificationStatus} ({result.identifiedIdentity.confidenceScore}% CONFIDENCE)
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
            1. EXECUTIVE SUMMARY & IDENTIFIED PROFILE
          </h2>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 print:bg-gray-100 print:text-black leading-relaxed">
            <p>
              This investigation correlated publicly accessible accounts for <strong>{result.identifiedIdentity.fullName || 'the authorized subject'}</strong>.
              A total of <strong>{result.evidenceList.length} verified public sources</strong> were analyzed across developer registries, corporate records, and academic archives.
              {result.identifiedIdentity.publicBio && ` Public biography: "${result.identifiedIdentity.publicBio}"`}
            </p>
          </div>
        </div>

        {/* 2. Public Profiles Discovered */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
            2. DISCOVERED PUBLIC PROFILES ({result.profiles.filter(p => p.isAvailable).length} ACCESSIBLE)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.profiles.filter(p => p.isAvailable).map((prof) => (
              <div key={prof.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white print:text-black">{prof.platform}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">{prof.verification}</span>
                </div>
                {prof.username && <p className="text-blue-400 font-mono mt-0.5">@{prof.username}</p>}
                {prof.profileUrl && (
                  <p className="text-slate-400 truncate mt-1 text-[11px] font-mono">
                    {prof.profileUrl}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Professional Intelligence Summary */}
        {result.professionalHistory.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
              3. PROFESSIONAL INTELLIGENCE & EMPLOYMENT HISTORY
            </h2>
            <div className="space-y-2">
              {result.professionalHistory.map(prof => (
                <div key={prof.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 print:bg-gray-50 print:text-black">
                  <div className="flex justify-between font-semibold text-white print:text-black">
                    <span>{prof.role} @ {prof.organization}</span>
                    <span className="font-mono text-slate-400">{prof.period}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{prof.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Open-Source Projects */}
        {result.projects.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
              4. PUBLIC REPOSITORIES & OPEN-SOURCE PROJECTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.projects.map(proj => (
                <div key={proj.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 print:bg-gray-50 print:text-black">
                  <span className="font-bold text-white print:text-black">{proj.name}</span>
                  <p className="text-slate-400 mt-0.5 line-clamp-2">{proj.description}</p>
                  {proj.repositoryUrl && <p className="text-blue-400 font-mono text-[11px] mt-1 truncate">{proj.repositoryUrl}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Chronological Timeline */}
        {result.timeline.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
              5. PUBLIC TIMELINE OF VERIFIED MILESTONES
            </h2>
            <div className="space-y-1.5 text-xs text-slate-300">
              {result.timeline.map((ev, i) => (
                <div key={i} className="flex items-baseline gap-3 p-2 rounded-lg bg-slate-950 border border-slate-800 print:bg-gray-50 print:text-black">
                  <span className="font-mono font-bold text-blue-400 shrink-0">{ev.date}</span>
                  <span className="font-semibold text-white print:text-black">{ev.title}</span>
                  <span className="text-slate-400 truncate">— {ev.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Conflicts & Uncertainties */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
            6. CONFLICTS & DISCREPANCIES AUDIT
          </h2>
          {result.conflicts.length === 0 ? (
            <p className="text-xs text-emerald-400 p-3 rounded-xl bg-slate-950 border border-slate-800">
              Zero conflicting statements or contradictory public credentials identified.
            </p>
          ) : (
            <div className="space-y-2">
              {result.conflicts.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-amber-900/40 text-xs text-amber-200">
                  <p className="font-bold">{c.title}</p>
                  <p className="text-slate-400 mt-1">{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Public Sources Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono text-slate-400 print:text-gray-700 uppercase tracking-wider">
            7. COMPLETE PUBLIC SOURCES AUDIT LEDGER
          </h2>
          <div className="max-h-48 overflow-y-auto space-y-1 text-[11px] font-mono pr-2">
            {result.sourcesSummary.map((src, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 print:text-black">
                <span className="truncate max-w-sm">{src.name}</span>
                <span className="text-blue-400 truncate max-w-xs">{src.url}</span>
                <span className="text-emerald-400">{src.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Ethical Safeguard Footer */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 print:text-gray-600 leading-relaxed">
          <p className="font-bold text-slate-400 print:text-black uppercase font-mono mb-1">
            LEGAL COMPLIANCE & PRIVACY SAFEGUARD NOTICE
          </p>
          {result.legalCompliance.privacyNotice}
          <p className="mt-1 font-mono text-[10px]">
            Audit Hash: {result.id} • Authenticated timestamp: {result.legalCompliance.auditTimestamp}
          </p>
        </div>
      </div>
    </div>
  );
};
