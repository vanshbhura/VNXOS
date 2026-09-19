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
  verificationUrl?: string;
}

// Configurable certificates data — empty until actual verified certificates are provided
export const certificatesData: Certificate[] = [];
