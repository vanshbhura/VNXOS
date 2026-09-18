export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string[];
  category: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  featured: boolean;
}

export const projectsData: Project[] = [
  {
    id: 'vnx-os',
    name: 'VNX.OS',
    shortDescription: 'A web-based desktop operating system portfolio.',
    detailedDescription: 'A fully functional simulated desktop operating system built with React, featuring a window manager, virtual filesystem, and custom applications.',
    technologies: ['React', 'TypeScript', 'Zustand', 'Framer Motion'],
    category: 'Web Application',
    image: '/assets/projects/vnx-os.png',
    githubUrl: 'https://github.com/vanshbhura/VNXOS',
    liveUrl: 'https://vnx-os.example.com',
    status: 'In Progress',
    featured: true,
  },
  {
    id: 'enterprise-ai',
    name: 'Enterprise AI Knowledge Hub',
    shortDescription: 'Centralized AI-powered knowledge management system.',
    detailedDescription: 'An enterprise solution leveraging LLMs and RAG to provide intelligent search and summarization over internal documents.',
    technologies: ['Python', 'FastAPI', 'React', 'LangChain', 'Pinecone'],
    category: 'Artificial Intelligence',
    image: '/assets/projects/enterprise-ai.png',
    githubUrl: 'https://github.com/vanshbhura',
    status: 'Completed',
    featured: true,
  },
  {
    id: 'crypto-agent',
    name: 'Crypto Agent',
    shortDescription: 'Autonomous agent for crypto market analysis.',
    detailedDescription: 'An autonomous agent that analyzes crypto market trends and executes simulated trades based on technical indicators.',
    technologies: ['Python', 'Pandas', 'scikit-learn', 'Binance API'],
    category: 'Machine Learning',
    image: '/assets/projects/crypto-agent.png',
    githubUrl: 'https://github.com/vanshbhura',
    status: 'Completed',
    featured: false,
  },
  {
    id: 'play2pro',
    name: 'Play2Pro',
    shortDescription: 'Gamified skill development platform.',
    detailedDescription: 'A web platform that gamifies learning professional skills with quests, badges, and leaderboards.',
    technologies: ['Next.js', 'TailwindCSS', 'PostgreSQL', 'Prisma'],
    category: 'Web Application',
    image: '/assets/projects/play2pro.png',
    githubUrl: 'https://github.com/vanshbhura',
    status: 'Completed',
    featured: true,
  },
  {
    id: 'roblox-rbd',
    name: 'Roblox Return by Death',
    shortDescription: 'A popular Roblox game experience.',
    detailedDescription: 'An immersive RPG experience on the Roblox platform with complex progression systems and multiplayer mechanics.',
    technologies: ['Luau', 'Roblox Studio'],
    category: 'Game Development',
    image: '/assets/projects/roblox-rbd.png',
    liveUrl: 'https://roblox.com',
    status: 'Completed',
    featured: false,
  }
];
