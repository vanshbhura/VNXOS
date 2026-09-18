export interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon?: string;
}

export const resourcesData: Resource[] = [
  {
    id: 'res-1',
    name: 'React Documentation',
    description: 'The official React documentation.',
    category: 'Web Development',
    url: 'https://react.dev',
    icon: 'BookOpen',
  },
  {
    id: 'res-2',
    name: 'TailwindCSS',
    description: 'A utility-first CSS framework for rapid UI development.',
    category: 'Web Development',
    url: 'https://tailwindcss.com',
    icon: 'Layout',
  },
  {
    id: 'res-3',
    name: 'Hugging Face',
    description: 'The AI community building the future.',
    category: 'AI / ML',
    url: 'https://huggingface.co',
    icon: 'Cpu',
  },
  {
    id: 'res-4',
    name: 'Kaggle',
    description: 'Machine Learning and Data Science Community.',
    category: 'Data Science',
    url: 'https://kaggle.com',
    icon: 'Database',
  }
];
