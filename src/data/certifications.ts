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

export const certificationsData: Certification[] = [
  {
    id: 'badge-1',
    title: 'Data Structures and Algorithms',
    platform: 'HackerRank',
    description: 'Verified skill badge for advanced problem solving and algorithm optimization.',
    skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
    date: 'May 2023',
    credentialId: 'HR-DSA-1234',
    credentialUrl: 'https://hackerrank.com',
    badgeUrl: '/assets/badges/hackerrank-dsa.png',
  },
  {
    id: 'badge-2',
    title: 'React Professional Developer',
    platform: 'Meta',
    description: 'Professional certification for building advanced React web applications.',
    skills: ['React', 'JavaScript', 'Frontend Development'],
    date: 'October 2023',
    badgeUrl: '/assets/badges/meta-react.png',
  }
];
