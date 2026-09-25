export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  technologies: string[];
  category: string;
  image?: string;
  githubUrl?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  status: 'LIVE' | 'DEVELOPMENT' | 'ARCHIVED' | 'Completed' | 'In Development' | 'In Progress' | 'Planned';
  featured: boolean;
  deployed?: boolean;
  isGitHub?: boolean;
  primaryLanguage?: string;
  topics?: string[];
  lastUpdated?: string;
  stars?: number;
  forks?: number;
}

export const curatedProjects: Project[] = [
  {
    id: 'vnx-os',
    name: 'VNX.OS',
    shortDescription: 'Interactive operating-system-style portfolio.',
    detailedDescription: 'An interactive operating-system-style portfolio where visitors explore engineering systems through a simulated desktop environment with a window manager, virtual filesystem, and native applications.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Lucide React', 'Framer Motion'],
    category: 'Web OS / Portfolio',
    image: '/assets/projects/vnxos.png',
    githubUrl: 'https://github.com/vanshbhura/VNXOS',
    repositoryUrl: 'https://github.com/vanshbhura/VNXOS',
    liveUrl: 'https://vanshbhura.antideploy.com/',
    status: 'LIVE',
    featured: true,
    deployed: true,
    primaryLanguage: 'TypeScript',
  },
  {
    id: 'wealthhub',
    name: 'WealthHub',
    shortDescription: 'Financial intelligence and wealth management platform.',
    detailedDescription: 'An advanced platform providing financial management, investment tracking, and portfolio intelligence.',
    technologies: ['Python'],
    category: 'FinTech / AI',
    image: '/assets/projects/wealthhub.png',
    githubUrl: 'https://github.com/vanshbhura/WealthHub',
    repositoryUrl: 'https://github.com/vanshbhura/WealthHub',
    liveUrl: 'https://wealthhub.antideploy.com/',
    status: 'LIVE',
    featured: true,
    deployed: true,
    primaryLanguage: 'Python',
  },
  {
    id: 'enterprise-ai-knowledge-hub',
    name: 'Enterprise AI Knowledge Hub',
    shortDescription: 'Enterprise-oriented document RAG application.',
    detailedDescription: 'An enterprise-oriented RAG application for uploading documents, performing semantic retrieval, asking questions about documents, and tracking source context.',
    technologies: ['Python', 'Streamlit', 'LangChain', 'Google Gemini', 'ChromaDB', 'Hugging Face Embeddings', 'RAG'],
    category: 'Artificial Intelligence',
    image: '/assets/projects/enterprise-ai-knowledge-hub.png',
    githubUrl: 'https://github.com/vanshbhura/Enterprise-AI-Knowledge-Hub-RAG',
    repositoryUrl: 'https://github.com/vanshbhura/Enterprise-AI-Knowledge-Hub-RAG',
    status: 'DEVELOPMENT',
    featured: true,
    deployed: false,
    primaryLanguage: 'Python',
  },
  {
    id: 'crypto-agent',
    name: 'Crypto Agent',
    shortDescription: 'AI-oriented crypto intelligence platform.',
    detailedDescription: 'An AI-oriented crypto intelligence platform designed for market analysis and automated information workflows.',
    technologies: ['Python', 'FastAPI', 'MongoDB', 'Redis', 'Docker', 'CCXT'],
    category: 'AI / Data Engineering',
    image: '/assets/projects/crypto-agent.png',
    status: 'DEVELOPMENT',
    featured: false,
    deployed: false,
    primaryLanguage: 'Python',
  },
  {
    id: 'play2pro',
    name: 'Play2Pro',
    shortDescription: 'Sports-focused digital platform project.',
    detailedDescription: 'A sports-focused digital platform project involving sports content and athlete/team-oriented experiences.',
    technologies: ['Flutter', 'FastAPI', 'PostgreSQL', 'AWS', 'OpenCV'],
    category: 'Mobile & Backend',
    image: '/assets/projects/play2pro.png',
    status: 'DEVELOPMENT',
    featured: false,
    deployed: false,
    primaryLanguage: 'Flutter',
  },
  {
    id: 'return-by-death',
    name: 'Return by Death',
    shortDescription: 'Roblox RPG survival and progression game.',
    detailedDescription: 'A Roblox game project based around survival, deaths, leaderboards, titles, skins, and progression/monetization mechanics.',
    technologies: ['Roblox Studio', 'Lua/Luau'],
    category: 'Game Development',
    image: '/assets/projects/return-by-death.png',
    status: 'DEVELOPMENT',
    featured: false,
    deployed: false,
    primaryLanguage: 'Lua',
  }
];

export const projectsData: Project[] = curatedProjects;
