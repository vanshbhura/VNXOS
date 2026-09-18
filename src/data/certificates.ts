export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
  credentialId?: string;
  credentialUrl?: string;
  assetPath?: string; // Path to image/pdf preview
}

export const certificatesData: Certificate[] = [
  {
    id: 'cert-1',
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'August 2023',
    description: 'Comprehensive specialization covering supervised learning, unsupervised learning, and recommender systems.',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
    credentialId: 'ABC123XYZ',
    credentialUrl: 'https://coursera.org',
    assetPath: '/assets/certificates/ml-specialization.png',
  },
  {
    id: 'cert-2',
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    date: 'January 2024',
    description: 'Demonstrated knowledge in designing and deploying scalable, highly available, and fault-tolerant systems on AWS.',
    skills: ['Cloud Computing', 'AWS', 'System Architecture'],
    credentialId: 'AWS-ASA-998877',
    credentialUrl: 'https://aws.amazon.com/certification',
    assetPath: '/assets/certificates/aws-cert.png',
  }
];
