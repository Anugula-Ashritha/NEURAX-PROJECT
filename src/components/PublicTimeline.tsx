import React from 'react';
import { 
  Clock, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  BookOpen, 
  Award,
  Mic,
  Trophy
} from 'lucide-react';
import { TimelineEvent, ConfidenceLevel } from '../types.ts';

interface PublicTimelineProps {
  timeline: TimelineEvent[];
}

export const PublicTimeline: React.FC<PublicTimelineProps> = ({ timeline }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Employment':
        return Briefcase;
      case 'Education':
        return GraduationCap;
      case 'Projects':
      case 'Open Source':
        return FolderGit2;
      case 'Publications':
        return BookOpen;
      case 'Conferences':
      case 'Public Appearance':
        return Mic;
      case 'Hackathons':
        return Trophy;
      default:
        return Calendar;
    }
  };

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Public Digital Footprint Timeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological ledger of publicly documented milestones, roles, and open source releases.
            </p>
          </div>
        </div>
      </div>

      {timeline.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500">
          <p className="text-sm">No chronological public milestones identified from public records.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6 ml-3 sm:ml-4 py-2">
          {timeline.map((event, idx) => {
            const Icon = getCategoryIcon(event.category);

            return (
              <div key={event.id || idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-7 h-7 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center text-blue-400 shadow-md">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Event Card */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-lg border border-blue-900/50">
                        {event.date}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {event.category}
                      </span>
                      {event.organization && (
                        <span className="text-xs font-semibold text-slate-300">
                          @ {event.organization}
                        </span>
                      )}
                    </div>

                    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadge(event.confidence)}`}>
                      {event.confidence} CONFIDENCE
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      Source: <strong className="text-slate-200">{event.source}</strong>
                    </span>

                    {event.sourceUrl && (
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                      >
                        <span>Verified Public Reference</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
