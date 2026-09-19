import type { WallpaperKey } from '../store/settingsStore';

export interface WallpaperPreset {
  id: WallpaperKey;
  name: string;
  description: string;
  background: string;
  previewGradient: string; // small swatch for picker
}

export const wallpapers: WallpaperPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora Night',
    description: 'Cinematic mountain & starry night',
    background: `
      radial-gradient(ellipse at 20% 80%, rgba(55, 14, 100, 0.45) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 20%, rgba(15, 50, 120, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(20, 10, 40, 0.6) 0%, transparent 70%),
      radial-gradient(ellipse at 70% 85%, rgba(180, 80, 20, 0.15) 0%, transparent 35%),
      linear-gradient(175deg, #030308 0%, #080818 25%, #0a0520 50%, #060412 75%, #020208 100%)
    `,
    previewGradient: 'linear-gradient(135deg, #030308 0%, #0a0520 50%, #060412 100%)',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Deep neon violet & cyan horizon',
    background: `
      radial-gradient(ellipse at 0% 100%, rgba(147, 51, 234, 0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 100% 0%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(30, 5, 60, 0.7) 0%, transparent 70%),
      linear-gradient(160deg, #050010 0%, #0d0025 40%, #00101a 100%)
    `,
    previewGradient: 'linear-gradient(135deg, #050010 0%, #0d0025 50%, #00101a 100%)',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Deep obsidian & emerald glow',
    background: `
      radial-gradient(ellipse at 50% 30%, rgba(0, 200, 80, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 70%, rgba(0, 120, 50, 0.2) 0%, transparent 45%),
      radial-gradient(ellipse at 80% 80%, rgba(0, 80, 30, 0.15) 0%, transparent 40%),
      linear-gradient(180deg, #010805 0%, #000e05 50%, #00050200 100%)
    `,
    previewGradient: 'linear-gradient(135deg, #010805 0%, #000e05 50%, #010805 100%)',
  },
  {
    id: 'sunset',
    name: 'Twilight Dusk',
    description: 'Warm twilight & purple dusk',
    background: `
      radial-gradient(ellipse at 50% 0%, rgba(251, 146, 60, 0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 60%, rgba(168, 85, 247, 0.45) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 40%, rgba(239, 68, 68, 0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 60% 90%, rgba(124, 58, 237, 0.4) 0%, transparent 50%),
      linear-gradient(175deg, #0c0515 0%, #1a0830 40%, #0d0418 80%, #080210 100%)
    `,
    previewGradient: 'linear-gradient(135deg, #0c0515 0%, #1a0830 50%, #0d0418 100%)',
  },
  {
    id: 'slate',
    name: 'Slate',
    description: 'Minimalist dark slate',
    background: `
      radial-gradient(ellipse at 30% 40%, rgba(71, 85, 105, 0.2) 0%, transparent 60%),
      linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
    `,
    previewGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  {
    id: 'light',
    name: 'Daylight',
    description: 'Clean daylight sky & silver mist',
    background: `
      radial-gradient(ellipse at 30% 20%, rgba(186, 230, 253, 0.6) 0%, transparent 55%),
      radial-gradient(ellipse at 70% 70%, rgba(165, 180, 252, 0.4) 0%, transparent 50%),
      linear-gradient(160deg, #f0f9ff 0%, #e0e7ff 50%, #f5f3ff 100%)
    `,
    previewGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f5f3ff 100%)',
  },
];

export function getWallpaper(id: WallpaperKey): WallpaperPreset {
  return wallpapers.find((w) => w.id === id) ?? wallpapers[0];
}
