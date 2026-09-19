import React from 'react';
import { 
  Briefcase, 
  Code2, 
  Share2, 
  Building2, 
  FolderGit2, 
  Calendar, 
  BookOpen, 
  Lightbulb, 
  AtSign, 
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  GitBranch,
  Star,
  Users,
  Award,
  Link2
} from 'lucide-react';
import { 
  ProfessionalItem, 
  TechnicalFootprintItem, 
  DiscoveredProfile, 
  OrganizationItem, 
  ProjectItem, 
  EventItem, 
  PublicationItem, 
  PatentItem, 
  AliasItem, 
  ConflictItem,
  ConfidenceLevel
} from '../types.ts';

// Helper for confidence badge
export const getConfidenceBadgeClass = (level: ConfidenceLevel) => {
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

// 1. Professional Intelligence Section (Section 18)
export const ProfessionalSection: React.FC<{ items: ProfessionalItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Professional Intelligence</h2>
            <p className="text-xs text-slate-400 mt-0.5">Discovered employment history, corporate roles, and academic qualifications.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No publicly documented employment records identified.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-900/50 text-[11px] font-mono text-blue-400 font-semibold uppercase">
                    {item.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(item.confidence)}`}>
                    {item.confidence}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{item.role}</h3>
                <p className="text-xs font-semibold text-slate-300 mt-0.5">@ {item.organization}</p>
                {item.period && <p className="text-[11px] font-mono text-slate-500 mt-1">{item.period}</p>}
                
                {item.evidence && (
                  <p className="text-xs text-slate-400 mt-3 p-3 rounded-xl bg-slate-950 border border-slate-900 leading-relaxed">
                    {item.evidence}
                  </p>
                )}

                {item.skills && item.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.skills.map((s, i) => (
                      <span key={i} className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {item.sourceUrl && (
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">Source: {item.source}</span>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    <span>Verify Public Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Technical Footprint Section (Section 19)
export const TechnicalFootprintSection: React.FC<{ items: TechnicalFootprintItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Technical Footprint & Developer Metrics</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real code repositories, programming languages, algorithmic problem stats, and commit telemetry.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No technical developer profiles discovered.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-blue-400">
                    {item.platform.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.platform}</h3>
                    <p className="text-xs font-mono text-blue-400">@{item.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(item.confidence)}`}>
                    {item.confidence}
                  </span>
                  {item.profileUrl && (
                    <a href={item.profileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <span>OPEN PROFILE</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              {Object.keys(item.stats).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {Object.entries(item.stats).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500 block truncate">{k}</span>
                      <span className="text-sm font-black text-white font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages */}
              {item.topLanguages && item.topLanguages.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-500">Primary Languages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.topLanguages.map((lang, idx) => (
                      <span key={idx} className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">
                <strong className="text-slate-300 font-mono text-[10px] uppercase block mb-0.5">Verification Evidence:</strong>
                {item.evidence}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Organizations Section (Section 21)
export const OrganizationsSection: React.FC<{ items: OrganizationItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-950/70 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Organizations & Institutions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Companies, universities, and professional communities associated with this public footprint.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No public organization affiliations discovered.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((org) => (
            <div key={org.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-violet-950/70 border border-violet-900/50 text-[11px] font-mono text-violet-300 font-semibold uppercase">
                    {org.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(org.confidence)}`}>
                    {org.confidence}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{org.name}</h3>
                {org.role && <p className="text-xs font-semibold text-blue-400 mt-0.5">{org.role}</p>}
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                  {org.evidence}
                </p>
              </div>

              {org.sourceUrl && (
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">Source: {org.source}</span>
                  <a href={org.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    <span>Verified Source Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Projects Section (Section 22)
export const ProjectsSection: React.FC<{ items: ProjectItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Project Intelligence</h2>
            <p className="text-xs text-slate-400 mt-0.5">Discovered open-source repositories, developer tools, and public digital products.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No public projects or code repositories identified.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((proj) => (
            <div key={proj.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">{proj.name}</h3>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(proj.confidence)}`}>
                    {proj.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{proj.description}</p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                  <strong className="text-slate-300 font-mono text-[10px] uppercase block mb-0.5">Evidence:</strong>
                  {proj.evidence}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500">Source: {proj.source}</span>
                {proj.repositoryUrl && (
                  <a href={proj.repositoryUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <span>OPEN REPOSITORY</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 5. Public Events & Hackathons (Section 23)
export const EventsSection: React.FC<{ items: EventItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-950/70 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Public Events & Hackathons</h2>
            <p className="text-xs text-slate-400 mt-0.5">Documented conference talks, hackathon participations, workshops, and panels.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No public event records identified.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((event) => (
            <div key={event.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-pink-950/70 border border-pink-900/50 text-[11px] font-mono text-pink-300 font-semibold uppercase">
                    {event.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(event.confidence)}`}>
                    {event.confidence}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{event.name}</h3>
                {event.role && <p className="text-xs font-semibold text-blue-400 mt-0.5">Role: {event.role}</p>}
                {event.date && <p className="text-[11px] font-mono text-slate-500 mt-0.5">{event.date}</p>}
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{event.description}</p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                  {event.evidence}
                </p>
              </div>

              {event.sourceUrl && (
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">Source: {event.source}</span>
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    <span>Verified Event URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 6. Publications & Research (Section 24)
export const PublicationsSection: React.FC<{ items: PublicationItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Publications & Research</h2>
            <p className="text-xs text-slate-400 mt-0.5">Published research papers, technical articles, and academic citations.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No publicly documented research publications or technical articles found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((pub) => (
            <div key={pub.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-900/50 text-[11px] font-mono text-cyan-300 font-semibold uppercase">
                    {pub.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(pub.confidence)}`}>
                    {pub.confidence}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{pub.title}</h3>
                {pub.publicationVenue && <p className="text-xs font-semibold text-slate-300 mt-0.5">Venue: {pub.publicationVenue}</p>}
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{pub.description}</p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                  {pub.evidence}
                </p>
              </div>

              {pub.sourceUrl && (
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">Source: {pub.source}</span>
                  <a href={pub.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    <span>Read Publication</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 7. Patents Section (Section 25)
export const PatentsSection: React.FC<{ items: PatentItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Patents & Inventions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Official patent registrations from official patent registers (USPTO, EPO, WIPO, Google Patents).</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-sm">
          <p className="font-semibold text-slate-300">No publicly documented patents found.</p>
          <p className="text-xs text-slate-500 mt-1">Official registers checked: Google Patents, USPTO & WIPO index.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((pat) => (
            <div key={pat.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-white">{pat.title}</h3>
                {pat.patentNumber && <p className="text-xs font-mono text-blue-400 mt-0.5">Patent #{pat.patentNumber}</p>}
                <p className="text-xs text-slate-300 mt-2">{pat.description}</p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                  {pat.evidence}
                </p>
              </div>
              {pat.sourceUrl && (
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
                  <a href={pat.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-xs">
                    <span>View Official Patent Filing</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 8. Aliases & Username Map (Section 26)
export const AliasesSection: React.FC<{ items: AliasItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <AtSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Alias & Username Correlation Map</h2>
            <p className="text-xs text-slate-400 mt-0.5">Known public handles, alternate usernames, and cross-platform identity monikers.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
          No alternate handles or secondary aliases discovered.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((alias) => (
            <div key={alias.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono font-bold text-blue-400">{alias.alias}</span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getConfidenceBadgeClass(alias.confidence)}`}>
                    {alias.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-semibold">{alias.platformOrContext}</p>
                <p className="text-xs text-slate-400 mt-1">{alias.possibleRelationship}</p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                  {alias.evidence}
                </p>
              </div>

              {alias.sourceLinks && alias.sourceLinks.length > 0 && (
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {alias.sourceLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 9. Conflicts & Uncertainties (Section 27)
export const ConflictsSection: React.FC<{ items: ConflictItem[] }> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Conflicts & Ambiguities</h2>
            <p className="text-xs text-slate-400 mt-0.5">Identified discrepancies across public sources requiring analyst manual verification.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-emerald-400 text-sm">
          <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
          <p className="font-semibold text-white">Zero Conflicting Information Detected</p>
          <p className="text-xs text-slate-400 mt-1">All verified public profiles, employer references, and repositories show consistent metadata.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((conflict) => (
            <div key={conflict.id} className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  {conflict.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[11px] font-mono font-semibold">
                  Requires verification
                </span>
              </div>

              <p className="text-xs text-slate-300">{conflict.description}</p>

              {/* Source A vs Source B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">CLAIM IN {conflict.sourceA.name}</span>
                  <p className="text-xs text-slate-200 font-semibold">{conflict.sourceA.claim}</p>
                  {conflict.sourceA.url && (
                    <a href={conflict.sourceA.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-2">
                      <span>Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">CLAIM IN {conflict.sourceB.name}</span>
                  <p className="text-xs text-slate-200 font-semibold">{conflict.sourceB.claim}</p>
                  {conflict.sourceB.url && (
                    <a href={conflict.sourceB.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-2">
                      <span>Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300">
                <span className="text-[10px] font-mono text-blue-400 uppercase block mb-0.5">RECOMMENDED INVESTIGATION GUIDANCE:</span>
                {conflict.investigationGuidance}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
