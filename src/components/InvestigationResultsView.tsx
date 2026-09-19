import React, { useState } from 'react';
import { 
  Globe, 
  GitMerge, 
  FileCheck2, 
  Network, 
  Clock, 
  Layers, 
  FileText, 
  Download, 
  Printer, 
  ExternalLink, 
  Share2, 
  AlertTriangle,
  Code2,
  Briefcase,
  Building2,
  FolderGit2,
  Calendar,
  BookOpen,
  Lightbulb,
  AtSign,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { InvestigationResult } from '../types.ts';
import { IdentifiedIdentity } from './IdentifiedIdentity.tsx';
import { PublicProfilesGrid } from './PublicProfilesGrid.tsx';
import { CorrelationPanel } from './CorrelationPanel.tsx';
import { EvidencePanel } from './EvidencePanel.tsx';
import { NetworkGraph } from './NetworkGraph.tsx';
import { PublicTimeline } from './PublicTimeline.tsx';
import { 
  ProfessionalSection, 
  TechnicalFootprintSection, 
  OrganizationsSection, 
  ProjectsSection, 
  EventsSection, 
  PublicationsSection, 
  PatentsSection, 
  AliasesSection, 
  ConflictsSection 
} from './IntelligenceSections.tsx';
import { ReportView } from './ReportView.tsx';

interface InvestigationResultsViewProps {
  result: InvestigationResult;
  onNewInvestigation: () => void;
}

export const InvestigationResultsView: React.FC<InvestigationResultsViewProps> = ({
  result,
  onNewInvestigation,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profiles' | 'graph' | 'correlation' | 'evidence' | 'timeline' | 'deep_intelligence' | 'report'
  >('profiles');

  const [deepSubTab, setDeepSubTab] = useState<
    'technical' | 'professional' | 'organizations' | 'projects' | 'events' | 'publications' | 'patents' | 'aliases' | 'conflicts'
  >('technical');

  const graphData = result.identityGraph || result.graph || { nodes: [], links: [] };

  const tabs = [
    { id: 'profiles', label: 'Discovered Profiles', icon: Globe, badge: result.profiles.filter(p => p.isAvailable).length },
    { id: 'graph', label: 'Identity Graph', icon: Network, badge: graphData.nodes?.length || 0 },
    { id: 'correlation', label: 'Correlation Signals', icon: GitMerge, badge: result.correlations.length },
    { id: 'evidence', label: 'Evidence & Sources', icon: FileCheck2, badge: result.evidenceList.length },
    { id: 'timeline', label: 'Public Timeline', icon: Clock, badge: result.timeline.length },
    { id: 'deep_intelligence', label: 'Deep Intelligence', icon: Layers, badge: result.conflicts.length > 0 ? '!' : undefined },
    { id: 'report', label: 'Intelligence Dossier', icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Bar: Back Action & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onNewInvestigation}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Public Investigation</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL PUBLIC DATA VERIFIED</span>
          </span>
          <span className="text-xs font-mono text-slate-500">
            ID: {result.id}
          </span>
        </div>
      </div>

      {/* Identified Target Identity (Section 3) */}
      <IdentifiedIdentity
        identity={result.identifiedIdentity}
        inputPhotoUrl={result.inputs?.consentedPhotoUrl || result.identifiedIdentity.photoUrl}
        confidenceScore={result.identifiedIdentity.confidenceScore}
        verificationStatus={result.identifiedIdentity.verificationStatus}
      />

      {/* Main Module Navigation Bar */}
      <div className="border-b border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      tab.badge === '!'
                        ? 'bg-amber-500 text-black font-bold'
                        : isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {/* 1. Profiles Grid */}
        {activeTab === 'profiles' && (
          <PublicProfilesGrid profiles={result.profiles} />
        )}

        {/* 2. Interactive Identity Graph */}
        {activeTab === 'graph' && (
          <NetworkGraph graph={graphData} targetName={result.identifiedIdentity.fullName} />
        )}

        {/* 3. Identity Correlation */}
        {activeTab === 'correlation' && (
          <CorrelationPanel correlations={result.correlations} />
        )}

        {/* 4. Verified Evidence */}
        {activeTab === 'evidence' && (
          <EvidencePanel evidenceList={result.evidenceList} />
        )}

        {/* 5. Chronological Public Timeline */}
        {activeTab === 'timeline' && (
          <PublicTimeline timeline={result.timeline} />
        )}

        {/* 6. Deep Intelligence Categorical View */}
        {activeTab === 'deep_intelligence' && (
          <div className="space-y-6">
            {/* Sub-navigation for deep categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'technical', label: 'Technical Footprint', icon: Code2, count: result.technicalFootprint.length },
                { id: 'professional', label: 'Professional History', icon: Briefcase, count: result.professionalHistory.length },
                { id: 'organizations', label: 'Organizations', icon: Building2, count: result.organizations.length },
                { id: 'projects', label: 'Open-Source Projects', icon: FolderGit2, count: result.projects.length },
                { id: 'events', label: 'Events & Talks', icon: Calendar, count: result.events.length },
                { id: 'publications', label: 'Publications & Articles', icon: BookOpen, count: result.publications.length },
                { id: 'patents', label: 'Patents & Inventions', icon: Lightbulb, count: result.patents.length },
                { id: 'aliases', label: 'Aliases & Handles', icon: AtSign, count: result.aliases.length },
                { id: 'conflicts', label: 'Conflicts & Ambiguities', icon: AlertTriangle, count: result.conflicts.length },
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = deepSubTab === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setDeepSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSubActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                    <span className="text-[10px] font-mono opacity-80">({sub.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Deep Sub-views */}
            {deepSubTab === 'technical' && <TechnicalFootprintSection items={result.technicalFootprint} />}
            {deepSubTab === 'professional' && <ProfessionalSection items={result.professionalHistory} />}
            {deepSubTab === 'organizations' && <OrganizationsSection items={result.organizations} />}
            {deepSubTab === 'projects' && <ProjectsSection items={result.projects} />}
            {deepSubTab === 'events' && <EventsSection items={result.events} />}
            {deepSubTab === 'publications' && <PublicationsSection items={result.publications} />}
            {deepSubTab === 'patents' && <PatentsSection items={result.patents} />}
            {deepSubTab === 'aliases' && <AliasesSection items={result.aliases} />}
            {deepSubTab === 'conflicts' && <ConflictsSection items={result.conflicts} />}
          </div>
        )}

        {/* 7. Printable and Exportable Dossier Report */}
        {activeTab === 'report' && (
          <ReportView result={result} />
        )}
      </div>
    </div>
  );
};
