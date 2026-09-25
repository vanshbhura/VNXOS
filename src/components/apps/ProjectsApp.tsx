import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { type Project, curatedProjects } from '../../data/projects';
import {
  mergeGitHubWithCurated,
  sortPortfolioProjects,
  fetchGitHubRepos,
  getCachedGitHubData,
  saveCachedGitHubData,
  getInitialProjects,
  CACHE_TTL_MS,
  type GitHubApiRepo,
} from '../../features/projects/githubSync';
import { useSettingsStore } from '../../store/settingsStore';
import {
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  Terminal,
  FolderGit2,
  CheckCircle2,
  WifiOff,
  Star,
  GitFork,
  X,
} from 'lucide-react';

function GitHubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function ProjectImage({ src, alt, category }: { src?: string; alt: string; category?: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 flex flex-col items-center justify-center text-slate-500 p-4 select-none relative group-hover:from-slate-900 group-hover:to-violet-950/20 transition-all duration-300">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-2 text-violet-400 group-hover:scale-110 group-hover:border-violet-500/40 transition-transform">
          <Terminal size={20} />
        </div>
        <span className="text-xs font-semibold text-slate-300 text-center tracking-wide line-clamp-1 px-2">{alt}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-mono">{category || 'Portfolio System'}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      onError={() => setHasError(true)} 
    />
  );
}

type FilterTab = 'all' | 'featured' | 'live' | 'github';

export default function ProjectsApp() {
  const initial = useMemo(() => getInitialProjects(), []);
  const [projects, setProjects] = useState<Project[]>(initial.projects);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'cached' | 'syncing' | 'offline'>(
    initial.isCached ? 'cached' : 'offline'
  );
  const [lastSyncedTime, setLastSyncedTime] = useState<number | null>(initial.timestamp);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync with GitHub API
  const syncWithGitHub = useCallback(async (isManualRefresh = false) => {
    if (isRefreshing) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSyncStatus('syncing');
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      const repos = await fetchGitHubRepos(controller.signal);
      if (!isMountedRef.current) return;

      const merged = mergeGitHubWithCurated(curatedProjects, repos);
      saveCachedGitHubData(repos);
      const now = Date.now();

      setProjects(merged);
      setSyncStatus('synced');
      setLastSyncedTime(now);

      if (isManualRefresh) {
        useSettingsStore.getState().addNotification({
          title: 'Projects Synced',
          message: `Synchronized ${repos.length} public GitHub repositories with VNX.OS portfolio.`,
          source: 'Projects',
          icon: 'FolderGit2',
        });
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      if (err instanceof Error && err.name === 'AbortError') return;

      console.warn('[VNX.OS Projects] GitHub API sync failed:', err);

      // Gracefully fall back to cached data or curated data
      const cached = getCachedGitHubData();
      if (cached && cached.repos.length > 0) {
        const merged = mergeGitHubWithCurated(curatedProjects, cached.repos);
        setProjects(merged);
        setSyncStatus('cached');
        setLastSyncedTime(cached.timestamp);
      } else {
        setProjects(sortPortfolioProjects(curatedProjects));
        setSyncStatus('offline');
      }

      if (isManualRefresh) {
        useSettingsStore.getState().addNotification({
          title: 'GitHub Offline',
          message: 'Unable to reach GitHub. Displaying cached portfolio projects.',
          source: 'Projects',
          icon: 'WifiOff',
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsRefreshing(false);
      }
    }
  }, [isRefreshing]);

  // Initial lightweight sync on mount
  useEffect(() => {
    isMountedRef.current = true;

    const cached = getCachedGitHubData();
    const now = Date.now();
    const isCacheFresh = cached && (now - cached.timestamp < CACHE_TTL_MS);

    if (isCacheFresh && cached) {
      // Instant cache hit
      const merged = mergeGitHubWithCurated(curatedProjects, cached.repos);
      setProjects(merged);
      setSyncStatus('cached');
      setLastSyncedTime(cached.timestamp);
    } else {
      // Stale or missing cache: trigger lightweight background sync
      syncWithGitHub(false);
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [syncWithGitHub]);

  // Handle manual user refresh
  const handleManualRefresh = () => {
    syncWithGitHub(true);
  };

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Tab filter
      if (activeFilter === 'featured' && !p.featured) return false;
      if (activeFilter === 'live' && !(p.status === 'LIVE' || p.liveUrl || p.deployed)) return false;
      if (activeFilter === 'github' && !p.githubUrl) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inShortDesc = p.shortDescription.toLowerCase().includes(q);
        const inDetailedDesc = (p.detailedDescription || '').toLowerCase().includes(q);
        const inTech = p.technologies.some((t) => t.toLowerCase().includes(q));
        const inCategory = p.category.toLowerCase().includes(q);
        return inName || inShortDesc || inDetailedDesc || inTech || inCategory;
      }

      return true;
    });
  }, [projects, activeFilter, searchQuery]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: projects.length,
      featured: projects.filter((p) => p.featured).length,
      live: projects.filter((p) => p.status === 'LIVE' || p.liveUrl || p.deployed).length,
      github: projects.filter((p) => Boolean(p.githubUrl)).length,
    };
  }, [projects]);

  // Format last synced text
  const lastSyncedLabel = useMemo(() => {
    if (!lastSyncedTime) return 'Curated Data';
    const secondsAgo = Math.floor((Date.now() - lastSyncedTime) / 1000);
    if (secondsAgo < 60) return 'Just now';
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo}h ago`;
  }, [lastSyncedTime]);

  return (
    <div className="w-full h-full text-slate-200 p-6 md:p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header section with Title, Subtitle, Sync Status & Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
              <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                GitHub Sync
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Verified portfolio projects and engineering systems synchronized with GitHub.
            </p>
          </div>

          {/* Sync status & Refresh button */}
          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
              {syncStatus === 'syncing' ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-violet-400" />
                  <span className="text-violet-300">Syncing...</span>
                </>
              ) : syncStatus === 'synced' ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-slate-300">Synced: {lastSyncedLabel}</span>
                </>
              ) : syncStatus === 'cached' ? (
                <>
                  <FolderGit2 size={13} className="text-sky-400" />
                  <span className="text-slate-300">Cached: {lastSyncedLabel}</span>
                </>
              ) : (
                <>
                  <WifiOff size={13} className="text-amber-400" />
                  <span className="text-amber-300/90">Offline / Curated</span>
                </>
              )}
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 active:scale-95 text-white text-xs font-medium transition-all duration-200 border border-white/15 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              title="Refresh project repositories from GitHub"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-violet-400' : ''} />
              <span>Refresh Projects</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All', count: counts.all },
                { id: 'featured', label: 'Featured', count: counts.featured },
                { id: 'live', label: 'Live', count: counts.live },
                { id: 'github', label: 'GitHub', count: counts.github },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-violet-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick search input */}
          <div className="relative min-w-[220px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech or project..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Project Cards List */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center space-y-3 my-8">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Search size={22} />
            </div>
            <h3 className="text-base font-semibold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              No portfolio projects matched your filter criteria or search query.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium underline cursor-pointer mt-1"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 group shadow-lg shadow-black/20"
              >
                {/* Project Image Left (Consistent with certificate UI preview) */}
                <div className="w-full md:w-60 h-44 md:h-auto bg-slate-900/90 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <ProjectImage src={project.image} alt={project.name} category={project.category} />
                </div>

                {/* Information Right */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    {/* Top Row: Title, Status, Featured & Category */}
                    <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                          {project.name}
                        </h2>

                        {/* Verified Status Label */}
                        {project.status === 'LIVE' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LIVE
                          </span>
                        ) : project.status === 'ARCHIVED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">
                            ARCHIVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            DEVELOPMENT
                          </span>
                        )}

                        {/* Featured Badge */}
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <Sparkles size={10} className="text-amber-400" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Category Badge */}
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80 flex-shrink-0">
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Project Descriptions */}
                    <p className="text-xs md:text-sm font-medium text-violet-300 mb-1.5">
                      {project.shortDescription}
                    </p>
                    {project.detailedDescription && project.detailedDescription !== project.shortDescription && (
                      <p className="text-xs md:text-sm text-slate-400 mb-3 leading-relaxed">
                        {project.detailedDescription}
                      </p>
                    )}
                    
                    {/* Technology Stack Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row: Stats & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 mt-auto">
                    {/* Stats & Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      {typeof project.stars === 'number' && project.stars > 0 && (
                        <span className="inline-flex items-center gap-1 text-amber-400/90" title="GitHub Stars">
                          <Star size={11} fill="currentColor" />
                          <span>{project.stars}</span>
                        </span>
                      )}
                      {typeof project.forks === 'number' && project.forks > 0 && (
                        <span className="inline-flex items-center gap-1 text-slate-400" title="GitHub Forks">
                          <GitFork size={11} />
                          <span>{project.forks}</span>
                        </span>
                      )}
                      {project.lastUpdated && (
                        <span className="text-slate-500">
                          Updated {new Date(project.lastUpdated).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: Strictly conditional, opens in new tab with target="_blank" and rel="noopener noreferrer" */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-all duration-200 border border-slate-700 hover:border-slate-600 shadow-sm"
                          title={`Open ${project.name} repository on GitHub`}
                        >
                          <GitHubIcon className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all duration-200 border border-violet-500 shadow-sm hover:shadow-violet-500/20"
                          title={`Visit live deployed page for ${project.name}`}
                        >
                          <ExternalLink size={13} />
                          <span>Visit Page</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
