export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
  credentialId?: string;
  credentialUrl?: string;
  assetPath?: string; // Path to image/pdf preview in public/assets/certificates/
  certificatePdf?: string; // Path to original certificate PDF
  verificationUrl?: string;
}

// Configurable certificates data
export const certificatesData: Certificate[] = [
  {
    id: 'code-crunch-dsa-2026',
    name: 'Code Crunch — DSA Competition',
    issuer: 'GeeksforGeeks • Suresh Gyan Vihar University',
    date: 'March 18–19, 2026',
    description: 'Certificate of Appreciation for Code Crunch — DSA Competition at India Is Innovating – 2K26, organized by Suresh Gyan Vihar University in collaboration with GeeksforGeeks.',
    skills: ['Data Structures', 'Algorithms', 'Problem Solving', 'Competitive Programming'],
    assetPath: '/assets/certificates/code-crunch-dsa-2026.png',
  },
  {
    id: 'internal-sih-2026',
    name: 'Internal Smart India Hackathon 2026',
    issuer: 'NIMS Sushma Innovation & Incubation Centre (NSIIC)',
    date: 'September 11, 2026',
    description: 'Certificate of Participation in the Internal Smart India Hackathon organized by NSIIC. Ranked 14th among 232 participating teams and nominated to represent the university in Smart India Hackathon 2026.',
    skills: ['Problem Solving', 'Innovation', 'Teamwork', 'Ideation', 'Technology'],
    assetPath: '/assets/certificates/sih-2026-internal.png',
  },
  {
    id: 'adobe-university-hackathon-2026',
    name: 'Adobe University Hackathon',
    issuer: 'Adobe • Unstop',
    date: 'August 9, 2026',
    description: 'Participated in the Adobe University Hackathon organized by Adobe through Unstop, representing Nims University (NU), Jaipur.',
    skills: ['Problem Solving', 'Coding', 'Innovation', 'Hackathon Experience'],
    assetPath: '/assets/certificates/adobe-university-hackathon-2026.png',
    certificatePdf: '/assets/certificates/adobe-university-hackathon-2026.pdf',
    credentialUrl: 'https://unstop.com/certificate-preview/6e554134-5e1b-4ebc-8853-99a1ef1fd1ec',
  },
  {
    id: 'amd-slingshot-ideathon-2026',
    name: 'AMD Slingshot Campus Days Ideathon 2026',
    issuer: 'AMD India',
    date: 'April 3, 2026',
    credentialId: '2026H25AMDSPR-P000072',
    description: 'Participated in the AMD Slingshot Campus Days Ideathon 2026 in Jaipur. The certificate recognizes active participation in the ideathon and work involving agentic workflows, vibe coding, and collaborative engineering.',
    skills: [
      'Agentic AI',
      'AI Workflows',
      'Vibe Coding',
      'Problem Solving',
      'Ideation',
      'Collaborative Engineering',
    ],
    assetPath: '/assets/certificates/amd-slingshot-ideathon-2026.png',
    certificatePdf: '/assets/certificates/amd-slingshot-ideathon-2026.pdf',
  },
  {
    id: 'chatgpt-codex-hackathon-2026',
    name: 'ChatGPT Codex Hackathon 2026',
    issuer: 'BlockseBlock',
    date: 'August 12, 2026',
    credentialId: 'BSB-ZT8EHH-MSCC9O08',
    description: 'Participated in the ChatGPT Codex Hackathon 2026 organized by BlockseBlock.',
    skills: [
      'AI Development',
      'Problem Solving',
      'Hackathon Experience',
      'Coding',
      'Innovation',
    ],
    assetPath: '/assets/certificates/chatgpt-codex-hackathon-2026.png',
    certificatePdf: '/assets/certificates/chatgpt-codex-hackathon-2026.pdf',
    credentialUrl: 'https://blockseblock.com/certificate_preview/BSB-ZT8EHH-MSCC90O8',
  },
  {
    id: 'deloitte-data-analytics-2026',
    name: 'Deloitte Data Analytics Job Simulation',
    issuer: 'Deloitte • Forage',
    date: 'April 5, 2026',
    credentialId: 'yw9wYNupe2QaCzPik',
    description: 'Completed the Deloitte Data Analytics Job Simulation through Forage, with practical tasks covering data analysis and forensic technology.',
    skills: [
      'Data Analysis',
      'Forensic Technology',
      'Data Interpretation',
      'Analytical Problem Solving',
    ],
    assetPath: '/assets/certificates/deloitte-data-analytics-2026.png',
    certificatePdf: '/assets/certificates/deloitte-data-analytics-2026.pdf',
  },
  {
    id: 'ideathon-2-first-position',
    name: 'IDEathon 2.0 — 1st Position',
    issuer: 'NIMSU Sushma Innovation & Incubation Foundation • NIMS University Rajasthan',
    date: 'July 31 – August 2, 2025',
    description: 'Secured first position as part of Team Power Glow in IDEathon 2.0, a national-level innovation challenge organized by the NIMSU Sushma Innovation & Incubation Foundation at NIMS University Rajasthan, Jaipur.',
    skills: [
      'Innovation',
      'Problem Solving',
      'Ideation',
      'Teamwork',
      'Collaborative Engineering',
    ],
    assetPath: '/assets/certificates/ideathon2026.png',
  },
  {
    id: 'rnex-campus-ambassador',
    name: 'RnEX Campus Ambassador',
    issuer: 'RnEX • E-Cell IIT Bhubaneswar',
    date: 'March 8, 2025',
    credentialId: 'CA24-RNX1-6963',
    description: 'Recognized for excellent initiatives and outstanding contributions made during the RnEX Campus Ambassador Program between February 2025 and March 2025.',
    skills: [
      'Communication',
      'Leadership',
      'Community Engagement',
      'Event Promotion',
      'Networking',
      'Initiative',
    ],
    assetPath: '/assets/certificates/campusambassador.png',
  },
  {
    id: 'internal-sih-2025',
    name: 'Internal Smart India Hackathon 2025',
    issuer: 'Nims Sushma Innovation and Incubation Center (NSIIC)',
    date: 'September 20, 2025',
    description: 'Participated in the Internal Smart India Hackathon 2025 organized by Nims Sushma Innovation and Incubation Center (NSIIC) at Nims University Rajasthan.',
    skills: [
      'Problem Solving',
      'Innovation',
      'Ideation',
      'Teamwork',
      'Technology',
      'Hackathon Experience',
    ],
    assetPath: '/assets/certificates/internal-sih-2025.png',
  },
  {
    id: 'internal-ideathon-2025',
    name: 'Internal IDEATHON 2025 — 6th Position',
    issuer: 'NIMSU Sushma Innovation & Incubation Center (NSIIC) • NIMS University Rajasthan',
    date: 'March 4–6, 2025',
    description: 'Actively participated in and presented Team Power Glow\'s project at the Internal IDEATHON 2025, held at NIET from 4th to 6th March 2025. Ranked 6th position out of 78 participating teams in the competition.',
    skills: [
      'Innovation',
      'Ideation',
      'Problem Solving',
      'Presentation',
      'Teamwork',
      'Product Development',
    ],
    assetPath: '/assets/certificates/ideathon-2025.png',
  },
  {
    id: 'abhivyakti-2025-beat-bunch',
    name: 'Abhivyakti 2025 — Beat-Bunch',
    issuer: 'Student Council • NIMS University Rajasthan',
    date: 'November 21–23, 2025',
    description: 'Participated in the Beat-Bunch (A Beat Generation) event at Abhivyakti 2025, the Nims Inter-College Cultural Fest held at NIMS University Rajasthan, Jaipur, from 21st to 23rd November 2025.',
    skills: [
      'Teamwork',
      'Creativity',
      'Performance',
      'Communication',
      'Event Participation',
    ],
    assetPath: '/assets/certificates/abhivyakti-2025-beat-bunch.png',
  },
];
