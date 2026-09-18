import React from 'react';
import { motion } from 'framer-motion';
import type { FileSystemNode } from '../../types/fs';
import { useOSStore } from '../../store/osStore';
import { getApp } from '../../data/apps';
import { getIconForNode } from '../apps/FileManager/FileGrid';

interface DesktopIconProps {
  icon: FileSystemNode;
}

// Removed inline LucideIcon in favor of getIconForNode

export default function DesktopIcon({ icon }: DesktopIconProps) {
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

    const appMap: Record<string, string> = {
      'Projects': 'projects',
      'About Me': 'about',
      'About': 'about',
      'Experience': 'experience',
      'Certificates': 'certificates',
      'Certification': 'certifications',
      'GitHub': 'github',
      'LinkedIn': 'linkedin',
      'Resources': 'resources',
      'AI Tools': 'ai-tools',
      'Notes.txt': 'notes',
      'Trash': 'trash'
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
      else console.log(`Opening ${icon.name} with default handler`);
      return;
    }

    // Default handler for now
    console.log(`Opening ${icon.name}`);
  };

  return (
    <motion.div
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onMouseDown={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: isSelected
            ? 'rgba(139, 92, 246, 0.2)'
            : 'rgba(255,255,255,0.04)',
          border: isSelected
            ? '1px solid rgba(139,92,246,0.4)'
            : '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.15s ease',
        }}
      >
        <div className="scale-[0.6] origin-center -m-1">
          {getIconForNode(icon)}
        </div>
      </div>
      <span className="desktop-icon-label">{icon.name}</span>
    </motion.div>
  );
}
