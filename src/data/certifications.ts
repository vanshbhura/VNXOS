export interface Certification {
  id: string;
  title: string;
  platform: string;
  description: string;
  skills: string[];
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

// Configurable skill certifications data — empty until actual verified certifications are provided
export const certificationsData: Certification[] = [];
