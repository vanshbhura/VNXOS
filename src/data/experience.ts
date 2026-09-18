export interface Experience {
  id: string;
  title: string;
  organization: string;
  type: string; // e.g., 'Full-time', 'Internship', 'Freelance'
  duration: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const experienceData: Experience[] = [
  {
    id: 'exp-1',
    title: 'Software Engineer',
    organization: 'Tech Innovations Inc.',
    type: 'Full-time',
    duration: '2024 - Present',
    description: 'Developing AI-driven web applications and scalable microservices.',
    technologies: ['React', 'Node.js', 'Python', 'Docker', 'AWS'],
    achievements: [
      'Architected a microservice that reduced data processing time by 40%.',
      'Implemented an internal AI tool that improved team productivity.'
    ]
  },
  {
    id: 'exp-2',
    title: 'Frontend Developer Intern',
    organization: 'Creative Digital',
    type: 'Internship',
    duration: '2023 - 2023',
    description: 'Built responsive and accessible user interfaces for e-commerce clients.',
    technologies: ['TypeScript', 'React', 'TailwindCSS', 'Redux'],
    achievements: [
      'Redesigned the checkout flow, increasing conversion rates by 15%.',
      'Created a reusable component library.'
    ]
  }
];
