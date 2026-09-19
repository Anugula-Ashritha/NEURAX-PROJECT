import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Code2, 
  Briefcase, 
  Share2, 
  BookOpen, 
  Calendar,
  Users,
  GitBranch,
  Star,
  Award
} from 'lucide-react';
import { DiscoveredProfile, VerificationStatus, ConfidenceLevel } from '../types.ts';

interface PublicProfilesGridProps {
  profiles: DiscoveredProfile[];
}

export const PublicProfilesGrid: React.FC<PublicProfilesGridProps> = ({ profiles }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'technical' | 'professional' | 'social' | 'research'>('all');

  const categories = [
    { id: 'all', label: 'All Platforms', icon: Globe },
    { id: 'technical', label: 'Developer & Technical', icon: Code2 },
    { id: 'professional', label: 'Professional & Corporate', icon: Briefcase },
    { id: 'social', label: 'Social & Media', icon: Share2 },
    { id: 'research', label: 'Research & Publications', icon: BookOpen },
  ];

  const filteredProfiles = (activeCategory === 'all' 
    ? profiles 
    : profiles.filter(p => p.category === activeCategory)).filter(p => p.isAvailable && p.profileUrl);

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
      case 'Strong Match':
        return 'bg-blue-950/80 text-blue-400 border-blue-500/50';
      case 'Possible Match':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/50';
      case 'Uncertain':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'Conflicting':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/50';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGH':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/40 border-amber-900/60';
      case 'LOW':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      case 'CONFLICTING':
        return 'text-rose-400 bg-rose-950/40 border-rose-900/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = cat.id === 'all' ? profiles.length : profiles.filter(p => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950/50'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProfiles.map((profile) => {
          const isVerifiedAndAvailable = profile.isAvailable && profile.profileUrl;

          return (
            <div
              key={profile.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isVerifiedAndAvailable
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                  : 'bg-slate-950/40 border-slate-900 opacity-75'
              }`}
            >
              <div>
                {/* Header: Platform & Verification Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.platform}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {profile.platform.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {profile.platform}
                      </h3>
                      {profile.username && (
                        <p className="text-xs font-mono text-blue-400">
                          @{profile.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold uppercase ${getVerificationBadge(profile.verification)}`}>
                    {profile.verification}
                  </span>
                </div>

                {/* Body: Discovered profile details or unavailable note */}
                {isVerifiedAndAvailable ? (
                  <div className="space-y-3 my-3 text-xs text-slate-300">
                    {profile.name && (
                      <p className="font-medium text-slate-200">
                        <span className="text-slate-500 font-mono">Name:</span> {profile.name}
                      </p>
                    )}

                    {profile.headline && (
                      <p className="text-slate-300 italic">
                        "{profile.headline}"
                      </p>
                    )}

                    {profile.bio && (
                      <p className="text-slate-400 line-clamp-3 leading-relaxed">
                        {profile.bio}
                      </p>
                    )}

                    {/* Stats strip */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                      {profile.publicRepos !== undefined && (
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-blue-400" />
                          <span>{profile.publicRepos} Repos</span>
                        </span>
                      )}
                      {profile.followers !== undefined && (
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-400" />
                          <span>{profile.followers} Followers</span>
                        </span>
                      )}
                      {profile.solvedProblems !== undefined && (
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>{profile.solvedProblems} Solved</span>
                        </span>
                      )}
                      {profile.ranking !== undefined && (
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                          <Star className="w-3 h-3 text-indigo-400" />
                          <span>Rank: {profile.ranking}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs text-slate-500">
                    <p className="font-semibold text-slate-400">
                      {profile.unavailableReason || 'Source unavailable'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {profile.confidenceReasoning || 'No public profile confirmed on this platform for the provided markers.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer: Confidence & Open Profile Button */}
              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadge(profile.confidence)}`}>
                  {profile.confidence} ({profile.confidenceScore}%)
                </div>

                {isVerifiedAndAvailable && profile.profileUrl ? (
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>OPEN PROFILE</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-slate-600">
                    NOT ACCESSIBLE
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
