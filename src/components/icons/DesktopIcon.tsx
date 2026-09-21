import React from 'react';
import { motion } from 'framer-motion';
import type { FileSystemNode } from '../../types/fs';
import { useOSStore } from '../../store/osStore';
import { getApp } from '../../data/apps';
import { getIconForNode } from '../apps/FileManager/FileGrid';
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL, openExternalLink } from '../../data/socialLinks';

interface DesktopIconProps {
  icon: FileSystemNode;
  size?: 'small' | 'medium' | 'large';
}

export default function DesktopIcon({ icon, size = 'medium' }: DesktopIconProps) {
  const selectedIconId = useOSStore((s) => s.selectedIconId);
  const selectIcon = useOSStore((s) => s.selectIcon);
  const openWindow = useOSStore((s) => s.openWindow);

  const isSelected = selectedIconId === icon.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectIcon(icon.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (icon.name === 'GitHub' || icon.id === 'desktop_github') {
      openExternalLink(GITHUB_PROFILE_URL);
      return;
    }
    if (icon.name === 'LinkedIn' || icon.id === 'desktop_linkedin') {
      openExternalLink(LINKEDIN_PROFILE_URL);
      return;
    }

    const appMap: Record<string, string> = {
      'Projects': 'projects',
      'About Me': 'about',
      'About': 'about',
      'Experience': 'experience',
      'Certificates': 'certificates',
      'Certification': 'certifications',
      'Resources': 'resources',
      'AI Tools': 'ai-tools',
      'Notes.txt': 'notes',
      'Trash': 'trash',
      'Terminal': 'terminal',
      'Command Prompt': 'cmd',
      'CMD': 'cmd',
      'PowerShell': 'powershell',
      'Snake': 'snake',
      'Impossible Tic Tac Toe': 'tictactoe',
      'Flappy Bird': 'flappy',
    };

    const targetAppId = appMap[icon.name];
    if (targetAppId) {
      const app = getApp(targetAppId);
      if (app) {
        openWindow(app);
        return;
      }
    }

    if (icon.type === 'folder' || icon.targetPath) {
      const app = getApp('file-manager');
      if (app) {
        const path = icon.targetPath || icon.path;
        openWindow(app, undefined, path, true);
      }
      return;
    }

    if (icon.extension === '.pdf') {
      const app = getApp('resume');
      if (app) openWindow(app);
      return;
    }

    // Default: open in file manager context
    const fm = getApp('file-manager');
    if (fm) {
      const dir = icon.path.split('/').slice(0, -1).join('/') || '/';
      openWindow(fm, undefined, dir, true);
    }
  };

  const boxDim = size === 'small' ? 38 : size === 'large' ? 52 : 44;
  const containerW = size === 'small' ? 70 : size === 'large' ? 92 : 80;
  const iconInnerScale = size === 'small' ? 'scale-[0.52]' : size === 'large' ? 'scale-[0.72]' : 'scale-[0.6]';
  const labelFont = size === 'small' ? 10.5 : size === 'large' ? 12 : 11;

  return (
    <motion.div
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={{ width: containerW }}
      onMouseDown={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      role="button"
      aria-label={`Desktop icon: ${icon.name}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleDoubleClick(e as unknown as React.MouseEvent); }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: boxDim,
          height: boxDim,
          borderRadius: size === 'large' ? 12 : 10,
          background: isSelected
            ? 'rgba(139, 92, 246, 0.25)'
            : 'rgba(255,255,255,0.05)',
          border: isSelected
            ? '1px solid rgba(167, 139, 250, 0.5)'
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: isSelected
            ? '0 0 14px rgba(139, 92, 246, 0.35)'
            : '0 4px 12px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.15s ease',
        }}
      >
        <div className={`${iconInnerScale} origin-center -m-1`}>
          {getIconForNode(icon)}
        </div>
      </div>
      <span
        className="desktop-icon-label"
        style={{ fontSize: labelFont, maxWidth: containerW - 8 }}
      >
        {icon.name}
      </span>
    </motion.div>
  );
}
