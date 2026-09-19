export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    category: 'Programming',
    skills: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript']
  },
  {
    category: 'AI / Machine Learning',
    skills: ['Machine Learning', 'Deep Learning', 'Scikit-learn', 'NumPy', 'Pandas']
  },
  {
    category: 'Web Development',
    skills: ['React', 'HTML', 'CSS', 'Vite']
  },
  {
    category: 'Cloud / Development',
    skills: ['AWS', 'Docker', 'Git', 'GitHub']
  },
  {
    category: 'Data',
    skills: ['Data Analysis', 'Data Visualization']
  }
];

export const allSkillsList: string[] = skillsData.flatMap(c => c.skills);
