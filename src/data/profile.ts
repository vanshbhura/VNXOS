export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration?: string;
  cgpa?: string;
  details?: string;
}

export interface Profile {
  name: string;
  role: string;
  introduction: string;
  education: Education[];
  technicalInterests: string[];
  currentFocus: string;
  socialLinks: SocialLink[];
  email?: string;
}

export const profileData: Profile = {
  name: 'Vansh Bhura',
  role: 'AI/ML Engineer',
  introduction: 'AI/ML Engineer passionate about intelligent systems, machine learning architectures, and scalable interactive software. Building next-generation tools and exploring the frontiers of artificial intelligence.',
  education: [
    {
      institution: 'NIMS University',
      degree: 'B.Tech in Artificial Intelligence & Machine Learning',
      cgpa: '8.3'
    }
  ],
  technicalInterests: [
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Retrieval-Augmented Generation (RAG)',
    'Full Stack Systems'
  ],
  currentFocus: 'Designing agentic workflows, scalable machine learning pipelines, and interactive web operating environments.',
  socialLinks: [
    {
      label: 'GitHub',
      url: 'https://github.com/vanshbhura',
      icon: 'Code'
    },
    {
      label: 'LinkedIn',
      url: '', // Leave empty until real LinkedIn URL is provided
      icon: 'User'
    }
  ]
};
