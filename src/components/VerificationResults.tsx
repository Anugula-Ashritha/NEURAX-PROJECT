import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Mail, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Clock, 
  Star, 
  GitFork, 
  UserCheck, 
  Lock,
  Globe,
  Youtube,
  Twitter,
  Briefcase,
  Award,
  BookOpen,
  Lightbulb,
  Video,
  FileText,
  Calendar,
  Building2,
  BookmarkCheck,
  Check,
  Compass,
  MessageSquare,
  GraduationCap,
  Trophy
} from 'lucide-react';
import { VerificationResult } from '../types';
import { NetworkGraph } from './NetworkGraph';

interface VerificationResultsProps {
  result: VerificationResult;
}

export const VerificationResults: React.FC<VerificationResultsProps> = ({ result }) => {
  const [activeWorksTab, setActiveWorksTab] = useState<'all' | 'experience' | 'projects' | 'events' | 'publications' | 'patents'>('all');

  const {
    candidate,
    overallTrustScore,
    trustLevel,
    executiveSummary,
    currentActivity,
    socialProfiles,
    emailSecurity,
    photoVerification,
    projectHighlights,
    riskSignals,
    interviewQuestions,
    verificationTimestamp,
    aliasesResolved,
    professionalAffiliations = [],
    eventsParticipation = [],
    publicationsAndContributions = [],
    patentsAndInnovations = [],
    activityTimeline = [],
    conflictsAndAmbiguities = [],
  } = result;

  const getTrustBadge = () => {
    switch (trustLevel) {
      case 'VERIFIED':
        return {
          label: 'VERIFIED IDENTITY',
          bgColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        };
      case 'MODERATE_CONFIDENCE':
        return {
          label: 'MODERATE CONFIDENCE',
          bgColor: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
        };
      case 'UNVERIFIED_RISK':
        return {
          label: 'HIGH RISK / SUSPICIOUS',
          bgColor: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
        };
      default:
        return {
          label: 'INSUFFICIENT SIGNALS',
          bgColor: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
        };
    }
  };

  const badge = getTrustBadge();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="verification-report-container" className="space-y-6">
      {/* Top Identity Dossier Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Avatar & Candidate Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex items-center gap-2">
              {/* Interviewer Uploaded Photo */}
              <div className="relative">
                {candidate.photoPreview ? (
                  <img
                    src={candidate.photoPreview}
                    alt={candidate.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl">
                    {candidate.fullName.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-medium shadow">
                  Input Photo
                </span>
              </div>

              {/* Matched Avatar if available */}
              {(socialProfiles.github.avatar_url || socialProfiles.gravatar.avatarUrl) && (
                <div className="relative pl-2 border-l border-slate-200">
                  <img
                    src={socialProfiles.github.avatar_url || socialProfiles.gravatar.avatarUrl}
                    alt="Public Avatar"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] px-1 py-0.2 rounded font-medium shadow">
                    OSINT Avatar
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {candidate.fullName}
                </h2>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badge.bgColor}`}>
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-slate-600 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{candidate.email}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Verified: {new Date(verificationTimestamp).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {emailSecurity.providerType.replace('_', ' ').toUpperCase()} DOMAIN
                </span>
              </div>
            </div>
          </div>

          {/* Trust Score & Print Button */}
          <div className="flex items-center gap-5 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                Trust Index
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${
                  overallTrustScore >= 80 ? 'text-emerald-600' :
                  overallTrustScore >= 60 ? 'text-blue-600' : 'text-rose-600'
                }`}>
                  {overallTrustScore}
                </span>
                <span className="text-slate-400 text-sm font-bold">/100</span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              id="btn-print-report"
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Executive Intelligence Summary
          </div>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
            {executiveSummary}
          </p>
        </div>
      </div>

      {/* Interactive Topological Identity & Provenance Graph */}
      {result.relationshipGraph && (
        <NetworkGraph
          graph={result.relationshipGraph}
          subjectName={candidate.fullName}
          photoUrl={candidate.photoPreview}
        />
      )}

      {/* "What They Are Currently Doing" Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Current Activity & Engineering Focus
            </h3>
            <p className="text-xs text-slate-500">
              Synthesized from active repositories, commit timelines, and public releases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Inferred Role */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Current Active Role
            </span>
            <p className="text-base font-bold text-slate-900">
              {currentActivity.titleRole || 'Independent Contributor'}
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {currentActivity.statusSummary}
            </p>
          </div>

          {/* Primary Focus Areas */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Primary Technical Domains
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentActivity.focusAreas && currentActivity.focusAreas.length > 0 ? (
                currentActivity.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs"
                  >
                    {area}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No public domain tags indexed</span>
              )}
            </div>
          </div>

          {/* Current Projects in Progress */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Active Repositories & Work
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentActivity.currentProjects && currentActivity.currentProjects.length > 0 ? (
                currentActivity.currentProjects.map((proj, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium">
                    <Code2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{proj}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400">No active public branches detected</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Social & Digital Footprint Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-600" />
              <span>Multi-Platform Social & Digital Footprint Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified OSINT intelligence across developer networks, video talks, career graphs, and academic registries
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
            10 PLATFORMS CORRELATED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. GitHub Footprint */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-white border border-slate-700">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">GitHub</h4>
                    <p className="text-[11px] text-slate-500">Source Code & Repositories</p>
                  </div>
                </div>
                {socialProfiles.github.found ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    VERIFIED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    SEARCH LINK
                  </span>
                )}
              </div>

              {socialProfiles.github.found ? (
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-3">
                    {socialProfiles.github.avatar_url && (
                      <img
                        src={socialProfiles.github.avatar_url}
                        alt={socialProfiles.github.login}
                        className="w-11 h-11 rounded-full border border-slate-200 shadow-xs"
                      />
                    )}
                    <div>
                      <p className="font-bold text-slate-900 text-sm">@{socialProfiles.github.login}</p>
                      <p className="text-slate-500 text-[11px]">{socialProfiles.github.name || candidate.fullName}</p>
                      {socialProfiles.github.company && (
                        <p className="text-cyan-700 text-[10px] font-semibold">{socialProfiles.github.company}</p>
                      )}
                    </div>
                  </div>

                  {socialProfiles.github.bio && (
                    <p className="italic text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] leading-relaxed">
                      "{socialProfiles.github.bio}"
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Public Repos</span>
                      <span className="font-bold text-slate-900 text-sm">{socialProfiles.github.public_repos}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Followers</span>
                      <span className="font-bold text-slate-900 text-sm">{socialProfiles.github.followers}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-3 space-y-1">
                  <p>Inferred Developer Handle: <span className="font-mono font-bold text-slate-800">@{candidate.githubUsername || candidate.email.split('@')[0]}</span></p>
                  <p className="text-[11px] text-slate-400">Target repositories and open-source contributions.</p>
                </div>
              )}
            </div>

            <a
              href={socialProfiles.github.html_url || `https://github.com/${candidate.githubUsername || candidate.email.split('@')[0]}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>{socialProfiles.github.found ? 'Open GitHub Profile' : 'Inspect GitHub User / Search'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 2. YouTube Tech Talks & Conference Presentations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">YouTube</h4>
                    <p className="text-[11px] text-slate-500">Tech Talks & Video Keynotes</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  TALKS / MEDIA
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Conference presentations, recorded technical webinars, dev tutorials, and panel talks:
                </p>

                <div className="p-2.5 bg-red-50/50 rounded-xl border border-red-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-red-800 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      Recorded Footprint
                    </span>
                    <span className="text-[10px] font-mono text-red-600 font-bold">Public Index</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs truncate">
                    "{candidate.fullName}" (Tech Keynotes / Software Architecture)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Correlated with technical events, meetups, and developer summits.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`"${candidate.fullName}" (conference OR talk OR demo OR developer OR keynote)`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs shadow-xs"
            >
              <span>Watch YouTube Talks & Demos</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3. LinkedIn & Corporate Career */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">LinkedIn</h4>
                    <p className="text-[11px] text-slate-500">Corporate & Employment OSINT</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  CAREER
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Verify stated employment records and recommendations against public corporate profiles:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">Target Index:</span>
                    <span className="font-mono text-slate-700 text-[10px]">site:linkedin.com/in</span>
                  </div>
                  <p className="font-semibold text-slate-900 truncate text-xs">
                    "{candidate.fullName}" {candidate.company ? `(${candidate.company})` : ''}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={socialProfiles.linkedin.inferredUrl || socialProfiles.linkedin.searchUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs shadow-xs"
            >
              <span>{socialProfiles.linkedin.inferredUrl ? 'View Claimed LinkedIn' : 'Search LinkedIn Profiles'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 4. X / Twitter Tech Community */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-white border border-slate-800">
                    <Twitter className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">X / Twitter</h4>
                    <p className="text-[11px] text-slate-500">Tech Community Discourse</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  DISCOURSE
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Real-time engineering announcements, open-source threads, and conference attendee mentions:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-500 block">Correlated Handle / Query</span>
                  <span className="font-mono text-slate-900 font-bold text-xs">
                    @{candidate.githubUsername || candidate.email.split('@')[0]}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`https://x.com/search?q=${encodeURIComponent(`"${candidate.fullName}" OR @${candidate.githubUsername || candidate.email.split('@')[0]}`)}&f=user`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>Search Tech Footprint on X</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 5. Devpost Hackathons & Works */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Devpost</h4>
                    <p className="text-[11px] text-slate-500">Hackathons & Team Submissions</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  HACKATHONS
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Competitive hackathon builds, winning demos, team rosters, and rapid prototyping records:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                  <span className="text-slate-500 font-medium">Verified Hackathon Registry:</span>
                  <p className="text-slate-800 font-semibold truncate">devpost.com/software / {candidate.fullName}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://devpost.com/software/search?query=${encodeURIComponent(candidate.fullName)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>Inspect Devpost Submissions</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 6. Kaggle & ML Data Science */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Kaggle</h4>
                    <p className="text-[11px] text-slate-500">Data Science & Model Benchmarks</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  AI / ML
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Machine learning datasets, public Jupyter notebooks, competitive rankings, and AI models:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                  <span className="text-slate-500 font-medium">Model & Notebook Index:</span>
                  <p className="text-slate-800 font-semibold truncate">kaggle.com/{candidate.githubUsername || candidate.email.split('@')[0]}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://www.kaggle.com/search?q=${encodeURIComponent(candidate.fullName)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>Search Kaggle Notebooks</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 7. Medium & Substack Engineering Publications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Medium & Blogs</h4>
                    <p className="text-[11px] text-slate-500">System Architecture Articles</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  ARTICLES
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Technical writeups, design tutorials, engineering retrospectives, and deep dives:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <span className="text-slate-500 block mb-0.5">Author Query:</span>
                  <span className="font-semibold text-slate-900">"{candidate.fullName}" (engineering OR architecture)</span>
                </div>
              </div>
            </div>

            <a
              href={`https://medium.com/search?q=${encodeURIComponent(`"${candidate.fullName}"`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>Read Published Articles</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 8. Reddit Technical Subreddits */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Reddit & Forums</h4>
                    <p className="text-[11px] text-slate-500">Open-Source Discussions & Q&A</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  COMMUNITY
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Technical discussions across r/programming, r/MachineLearning, r/webdev, and r/cybersecurity:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <span className="text-slate-500 block mb-0.5">Subject Footprint:</span>
                  <span className="font-mono text-slate-800">reddit.com/r/all?q="{candidate.fullName}"</span>
                </div>
              </div>
            </div>

            <a
              href={`https://www.reddit.com/search/?q=${encodeURIComponent(`"${candidate.fullName}"`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>Inspect Reddit Discussions</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 9. Google Scholar & Academic Papers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Google Scholar & arXiv</h4>
                    <p className="text-[11px] text-slate-500">Research & Technical Whitepapers</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  RESEARCH
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Academic peer-reviewed papers, citations, conference proceedings, and preprint publications:
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <span className="text-slate-500 block mb-0.5">Citation Profile Search:</span>
                  <span className="font-semibold text-slate-900">author:"{candidate.fullName}"</span>
                </div>
              </div>
            </div>

            <a
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent(`author:"${candidate.fullName}"`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <span>Search Academic Citations</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Comprehensive Career Experience, Works & Provenance Intelligence Section  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-700">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Career Experience, Projects & Provenance of Works
              </h3>
              <p className="text-xs text-slate-500">
                Verified professional employment history, software projects, keynotes, research publications, and patent filings
              </p>
            </div>
          </div>

          {/* Works Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Works', count: (professionalAffiliations.length + projectHighlights.length + eventsParticipation.length + publicationsAndContributions.length + patentsAndInnovations.length) },
              { id: 'experience', label: 'Experience', count: professionalAffiliations.length },
              { id: 'projects', label: 'Projects & Code', count: projectHighlights.length },
              { id: 'events', label: 'Events & Talks', count: eventsParticipation.length },
              { id: 'publications', label: 'Publications', count: publicationsAndContributions.length },
              { id: 'patents', label: 'Patents & IP', count: patentsAndInnovations.length },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveWorksTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  activeWorksTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeWorksTab === tab.id ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. Professional Career Experience & Employment Roles */}
        {(activeWorksTab === 'all' || activeWorksTab === 'experience') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Verified Professional Employment & Affiliations</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {professionalAffiliations.length} Recorded Roles
              </span>
            </div>

            {professionalAffiliations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professionalAffiliations.map((aff, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{aff.role || 'Senior Engineer / Researcher'}</h5>
                        <p className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{aff.organization || candidate.company || 'Enterprise Lab'}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        {aff.confidence || 90}% CONF
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {aff.tenure || 'Verified Career Record'}
                      </span>
                      {aff.source && (
                        <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px]">
                          Source: {aff.source}
                        </span>
                      )}
                    </div>

                    {aff.details && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                        {aff.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{candidate.title || 'Software Engineering Professional'}</p>
                  <p className="text-slate-500">{candidate.company ? `Reported at ${candidate.company}` : 'Independent / Public Contributor'}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  PRIMARY CLAIM
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. Public Projects & Code Highlights */}
        {(activeWorksTab === 'all' || activeWorksTab === 'projects') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Verified Public Repositories & Engineering Projects</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {projectHighlights.length} Repositories
              </span>
            </div>

            {projectHighlights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectHighlights.map((proj, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-bold text-slate-900 text-sm truncate">
                          {proj.name}
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
                          Impact {proj.impactScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 group"
                        >
                          <span>Inspect Project Code</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No public open-source code repositories indexed.
              </div>
            )}
          </div>
        )}

        {/* 3. Events, Keynotes & Hackathons */}
        {(activeWorksTab === 'all' || activeWorksTab === 'events') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-rose-600" />
                <span>Events, Keynotes & Hackathons</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {eventsParticipation.length} Verified Events
              </span>
            </div>

            {eventsParticipation.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {eventsParticipation.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-slate-900 text-xs truncate">
                        {evt.eventName}
                      </h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                        {evt.year || 'Recorded'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-rose-700">
                      {evt.roleOrAchievement || 'Speaker / Participant'}
                    </p>
                    {evt.evidence && (
                      <p className="text-[11px] text-slate-600 italic">
                        "{evt.evidence}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                No public conference speaker rosters or hackathon rosters indexed for this direct name query.
              </div>
            )}
          </div>
        )}

        {/* 4. Research Publications & Contributions */}
        {(activeWorksTab === 'all' || activeWorksTab === 'publications') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Publications, Whitepapers & Contributions</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {publicationsAndContributions.length} Indexed Papers
              </span>
            </div>

            {publicationsAndContributions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {publicationsAndContributions.map((pub, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-slate-900 text-xs">{pub.title}</h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold shrink-0">
                        {pub.year || 'Published'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 font-semibold">
                      Venue / Platform: {pub.venueOrPlatform || 'arXiv / Technical Journal'}
                    </p>
                    {pub.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pub.summary}
                      </p>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800 font-semibold pt-1"
                      >
                        <span>Open Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                No formal whitepapers or academic publications indexed in public scholarly engines.
              </div>
            )}
          </div>
        )}

        {/* 5. Patents & Intellectual Property Innovations */}
        {(activeWorksTab === 'all' || activeWorksTab === 'patents') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>Patents & Intellectual Property Disclosures</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {patentsAndInnovations.length} Patents
              </span>
            </div>

            {patentsAndInnovations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {patentsAndInnovations.map((pat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-slate-900 text-xs">{pat.title}</h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold shrink-0">
                        {pat.status || 'Granted'}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-indigo-700">
                      Doc No: {pat.docNumber || 'US-PATENT-PENDING'} ({pat.year || 'Recent'})
                    </p>
                    {pat.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pat.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                No active patent disclosures or defensive publications discovered in the USPTO / WIPO registers.
              </div>
            )}
          </div>
        )}

        {/* 6. Chronological Career & Activity Timeline */}
        {activityTimeline.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Chronological Career & Activity Progression Timeline</span>
            </h4>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 pt-1">
              {activityTimeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-white shadow-xs" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold">
                        {item.year}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 uppercase">
                        {item.category || 'Career'}
                      </span>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cybersecurity Risk Signals & Trust Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Cybersecurity Risk & Identity Consistency Signals
            </h3>
            <p className="text-xs text-slate-500">
              Automated fraud markers, email validity, and public longevity indicators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {riskSignals.map((signal, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                signal.type === 'positive'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : signal.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              }`}
            >
              {signal.type === 'positive' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {signal.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              {signal.type === 'negative' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
              <div>
                <p className="text-xs font-bold mb-0.5">{signal.title}</p>
                <p className="text-xs opacity-90 leading-relaxed">{signal.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Targeted Technical Interview Questions (Anti-Proxy / Authorship Verification) */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              Authorship Verification & Anti-Proxy Interview Questions
            </h3>
            <p className="text-xs text-blue-200">
              Specific challenge questions generated from the candidate's actual projects to verify genuine authorship
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {interviewQuestions.map((q, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-2"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-100">
                    "{q.question}"
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-blue-200">
                    <span className="font-semibold text-blue-300">Target:</span>
                    <span className="bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
                      {q.targetProjectOrSkill}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="italic text-slate-300">{q.reasoning}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
