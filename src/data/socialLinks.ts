export const GITHUB_PROFILE_URL = 'https://github.com/vanshbhura';
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/vansh-bhura-8b93b1331/';

export function openExternalLink(url: string) {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}