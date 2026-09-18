export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  details?: string;
}

export interface Profile {
  name: string;
  role: string;
  introduction: string;
  education: Education[];
  technicalInterests: string[];
  skills: string[];
  currentFocus: string;
  socialLinks: SocialLink[];
  email: string;
}

export const profileData: Profile = {
  name: 'Vansh Bhura',
  role: 'Software Engineer & AI Specialist',
  introduction: 'I build robust applications and intelligent systems, focusing on AI-driven solutions and seamless user experiences. Welcome to my personal OS portfolio.',
  education: [
    {
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      duration: '2020 - 2024',
      details: 'Specialization in Machine Learning and Systems Architecture.'
    }
  ],
  technicalInterests: ['Artificial Intelligence', 'Agentic Workflows', 'Web Development', 'Systems Design'],
  skills: ['TypeScript', 'React', 'Python', 'Machine Learning', 'Node.js', 'Go'],
  currentFocus: 'Building scalable AI agents and next-gen operating system interfaces for the web.',
  email: 'hello@example.com',
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/vanshbhura', icon: 'Github' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
    { label: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' }
  ]
};
