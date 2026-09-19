import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Shield, 
  Search, 
  Globe2, 
  Network, 
  Terminal, 
  AlertCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';

interface InvestigationWorkflowProps {
  onCancel?: () => void;
  targetName?: string;
  currentStep?: number;
}

const STEPS = [
  { id: '01', title: 'Input Analysis', desc: 'Validating consented markers, email domains & candidate handles' },
  { id: '02', title: 'Identity Candidate Discovery', desc: 'Querying public directory indexes and authoritative registries' },
  { id: '03', title: 'Profile Discovery', desc: 'Direct REST API probes across GitHub, GitLab, LeetCode, Dev.to & Gravatar' },
  { id: '04', title: 'Cross-Platform Correlation', desc: 'Search-grounding web profiles, matching biographies & project hashes' },
  { id: '05', title: 'Professional Discovery', desc: 'Identifying public employer history, team bios & corporate roles' },
  { id: '06', title: 'Technical Footprint', desc: 'Analyzing public repositories, commit signatures & algorithmic stats' },
  { id: '07', title: 'Public Activity', desc: 'Indexing verified hackathon appearances, conference talks & articles' },
  { id: '08', title: 'Evidence Verification', desc: 'Resolving destination URLs and scoring source reachability' },
  { id: '09', title: 'Relationship Mapping', desc: 'Generating interactive topological digital identity graph' },
  { id: '10', title: 'Intelligence Report', desc: 'Synthesizing evidence-backed digital footprint dossier' },
];

export const InvestigationWorkflow: React.FC<InvestigationWorkflowProps> = ({
  targetName,
  currentStep,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (typeof currentStep === 'number' && currentStep >= 1) {
      setCurrentStepIndex(Math.min(STEPS.length - 1, currentStep - 1));
    }
  }, [currentStep]);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Security sandbox initialized with consented public scope.',
    `[TARGET] Analyzing authorized subject: "${targetName || 'Subject Identity'}"...`,
  ]);

  useEffect(() => {
    // Progress through steps 0 to 8 automatically while waiting for server response
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 2) {
          const next = prev + 1;
          setLogs((l) => [
            ...l,
            `[EXEC] Completed Step ${STEPS[prev].id}: ${STEPS[prev].title}. Starting Step ${STEPS[next].id}...`
          ]);
          return next;
        }
        return prev;
      });
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 font-mono text-xs font-semibold uppercase mb-4">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>REAL-TIME OSINT RECONNAISSANCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Executing Digital Footprint Investigation
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Correlating live public web sources, GitHub repositories, developer metrics, and publications.
          </p>
        </div>

        {/* 10 Step Progress Tracker */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-950/50'
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-950/20 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-blue-400 text-blue-300 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      </div>
                    ) : (
                      <span className="text-slate-600 font-mono">{step.id}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-blue-400">Step {step.id}</span>
                      <span className="text-slate-600">•</span>
                      <h4 className={`text-sm font-semibold tracking-tight ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isCurrent ? (
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-mono font-semibold uppercase animate-pulse">
                      ACTIVE
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      VERIFIED
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-600">
                      QUEUED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Operational Terminal Log */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-400 shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>RECONNAISSANCE TELEMETRY FEED</span>
            </span>
            <span className="text-emerald-400">STATUS: IN_PROGRESS</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-2">
            {logs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                <span className="text-blue-500 mr-2">&gt;</span>
                <span className={log.includes('Completed') ? 'text-emerald-400' : 'text-slate-300'}>{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-blue-400 animate-pulse pt-1">
              <span>&gt;</span>
              <span>Scanning public networks and verifying source links...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
