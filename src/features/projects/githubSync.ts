import { type Project, curatedProjects } from '../../data/projects';

export interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  pushed_at: string;
}

export interface CachedGitHubData {
  timestamp: number;
  repos: GitHubApiRepo[];
}

export const GITHUB_USERNAME = 'vanshbhura';
export const GITHUB_REPOS_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=public&sort=updated&per_page=100`;
export const CACHE_KEY = 'vnx_github_repos_v1';
export const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Filter out forks, config repositories, empty experiments, or daily scratch repos.
 */
const EXCLUDED_REPOS = new Set([
  'vanshbhura', // Personal profile README repository
  'forachievements', // Scratch repository with no code
  'python-daily-practice', // Daily basic exercises
  'machine-learning-journey', // Learning notes repository
  'open-source-practice', // Fork / practice repository
]);

export function isValidPortfolioRepo(repo: GitHubApiRepo): boolean {
  if (repo.fork) return false;
  if (repo.archived) return false;
  const lower = repo.name.toLowerCase();
  if (lower === GITHUB_USERNAME.toLowerCase()) return false;
  if (EXCLUDED_REPOS.has(lower)) return false;
  return true;
}

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[-_.\s]/g, '');
}

/**
 * Check if a GitHub repository matches any manually curated project.
 */
export function findMatchingCuratedProject(
  repo: GitHubApiRepo,
  curated: Project[]
): Project | undefined {
  const normRepoName = normalizeKey(repo.name);
  const repoUrl = repo.html_url.toLowerCase();

  return curated.find((p) => {
    if (p.githubUrl && p.githubUrl.toLowerCase() === repoUrl) return true;
    if (normalizeKey(p.name) === normRepoName) return true;
    if (normalizeKey(p.id) === normRepoName) return true;
    // Special matching for Enterprise-AI-Knowledge-Hub-RAG -> enterprise-ai-knowledge-hub
    if (
      normRepoName.includes('enterpriseaiknowledgehub') &&
      normalizeKey(p.id).includes('enterpriseaiknowledgehub')
    ) {
      return true;
    }
    return false;
  });
}

/**
 * Format repository name to human-readable title.
 */
export function formatRepoTitle(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Merge GitHub repositories with manually curated project data.
 * Curated metadata strictly prevails for descriptions, featured status, category,
 * technologies, and verified deployment URLs.
 */
export function mergeGitHubWithCurated(
  curated: Project[],
  repos: GitHubApiRepo[]
): Project[] {
  const matchedRepoNames = new Set<string>();

  // 1. Process curated projects and enrich with GitHub data if available
  const enrichedCurated: Project[] = curated.map((curatedProj) => {
    const matchingRepo = repos.find((repo) => {
      const match = findMatchingCuratedProject(repo, [curatedProj]);
      return !!match;
    });

    if (matchingRepo) {
      matchedRepoNames.add(matchingRepo.name.toLowerCase());
      
      const verifiedLiveUrl = curatedProj.liveUrl || (
        matchingRepo.homepage && matchingRepo.homepage.startsWith('http')
          ? matchingRepo.homepage
          : undefined
      );

      const isLive = Boolean(verifiedLiveUrl);

      return {
        ...curatedProj,
        githubUrl: matchingRepo.html_url,
        repositoryUrl: matchingRepo.html_url,
        liveUrl: verifiedLiveUrl,
        primaryLanguage: matchingRepo.language || curatedProj.technologies[0],
        topics: matchingRepo.topics && matchingRepo.topics.length > 0 ? matchingRepo.topics : undefined,
        lastUpdated: matchingRepo.updated_at,
        stars: matchingRepo.stargazers_count,
        forks: matchingRepo.forks_count,
        isGitHub: true,
        deployed: isLive,
        status: isLive ? 'LIVE' : (matchingRepo.archived ? 'ARCHIVED' : 'DEVELOPMENT'),
      };
    }

    const isLive = Boolean(curatedProj.liveUrl);
    return {
      ...curatedProj,
      deployed: isLive,
      status: isLive ? 'LIVE' : curatedProj.status,
    };
  });

  // 2. Discover new valid public repositories from GitHub
  const discoveredGitHubProjects: Project[] = repos
    .filter((repo) => isValidPortfolioRepo(repo) && !matchedRepoNames.has(repo.name.toLowerCase()))
    .map((repo) => {
      const verifiedLiveUrl = repo.homepage && repo.homepage.startsWith('http')
        ? repo.homepage
        : undefined;
      const isLive = Boolean(verifiedLiveUrl);

      return {
        id: `gh-${repo.name.toLowerCase()}`,
        name: formatRepoTitle(repo.name),
        shortDescription: repo.description || 'Public GitHub engineering project by Vansh Bhura.',
        detailedDescription: repo.description || undefined,
        technologies: repo.language ? [repo.language] : ['Software'],
        category: verifiedLiveUrl
          ? 'Web Application'
          : repo.language === 'Python'
          ? 'Python / AI'
          : 'Software Engineering',
        githubUrl: repo.html_url,
        repositoryUrl: repo.html_url,
        liveUrl: verifiedLiveUrl,
        status: isLive ? 'LIVE' : (repo.archived ? 'ARCHIVED' : 'DEVELOPMENT'),
        featured: false,
        deployed: isLive,
        isGitHub: true,
        primaryLanguage: repo.language || undefined,
        topics: repo.topics && repo.topics.length > 0 ? repo.topics : undefined,
        lastUpdated: repo.updated_at,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      };
    });

  // 3. Combine and sort
  const combined = [...enrichedCurated, ...discoveredGitHubProjects];
  return sortPortfolioProjects(combined);
}

/**
 * Sorting logic:
 * 1. Featured projects (VNX.OS, WealthHub, Enterprise AI Knowledge Hub)
 * 2. Live/deployed projects
 * 3. Recently updated GitHub projects
 */
export function sortPortfolioProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    // 1. Featured projects first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    // 2. Live / deployed projects next
    const aLive = a.status === 'LIVE' || Boolean(a.liveUrl) || Boolean(a.deployed);
    const bLive = b.status === 'LIVE' || Boolean(b.liveUrl) || Boolean(b.deployed);
    if (aLive !== bLive) {
      return aLive ? -1 : 1;
    }

    // 3. Recently updated GitHub projects
    if (a.lastUpdated && b.lastUpdated) {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    }
    if (a.lastUpdated) return -1;
    if (b.lastUpdated) return 1;

    return 0;
  });
}

/**
 * Cache operations
 */
export function getCachedGitHubData(): CachedGitHubData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedGitHubData = JSON.parse(raw);
    if (Array.isArray(parsed?.repos)) {
      return parsed;
    }
  } catch (err) {
    console.warn('[VNX.OS] Error reading cached GitHub repos:', err);
  }
  return null;
}

export function saveCachedGitHubData(repos: GitHubApiRepo[]): void {
  try {
    const data: CachedGitHubData = {
      timestamp: Date.now(),
      repos,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[VNX.OS] Error saving GitHub repos to cache:', err);
  }
}

/**
 * Public GitHub repos fetcher with timeout and validation.
 */
export async function fetchGitHubRepos(signal?: AbortSignal): Promise<GitHubApiRepo[]> {
  const response = await fetch(GITHUB_REPOS_API, {
    signal,
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Malformed GitHub API response: expected repository array');
  }

  return data as GitHubApiRepo[];
}

/**
 * Helper to get the initial list of projects (from cache or curated fallback).
 */
export function getInitialProjects(): { projects: Project[]; isCached: boolean; timestamp: number | null } {
  const cached = getCachedGitHubData();
  if (cached && cached.repos.length > 0) {
    return {
      projects: mergeGitHubWithCurated(curatedProjects, cached.repos),
      isCached: true,
      timestamp: cached.timestamp,
    };
  }

  return {
    projects: sortPortfolioProjects(curatedProjects),
    isCached: false,
    timestamp: null,
  };
}
