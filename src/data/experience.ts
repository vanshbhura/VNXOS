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

// Configurable experience data — empty until actual verified experience entries are configured
export const experienceData: Experience[] = [];
