import React from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../store/osStore';
import { useFileSystemStore } from '../../store/fsStore';
import DesktopIcon from '../icons/DesktopIcon';
import type { ContextMenuItem } from '../../types/os';

// Cinematic mountain/night wallpaper via CSS gradient
const wallpaperStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `
    radial-gradient(ellipse at 20% 80%, rgba(55, 14, 100, 0.45) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(15, 50, 120, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(20, 10, 40, 0.6) 0%, transparent 70%),
    radial-gradient(ellipse at 70% 85%, rgba(180, 80, 20, 0.15) 0%, transparent 35%),
    linear-gradient(175deg, #030308 0%, #080818 25%, #0a0520 50%, #060412 75%, #020208 100%)
  `,
};

// Subtle star particles
function Stars() {
  const stars = React.useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 4,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: 'white',
            opacity: star.opacity,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity] }}
          transition={{ repeat: Infinity, duration: 3 + Math.random() * 3, delay: star.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Mountain silhouette
function MountainSilhouette() {
  return (
    <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, pointerEvents: 'none' }}>
      <svg viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', display: 'block' }} preserveAspectRatio="xMidYMax slice">
        <path d="M0,300 L0,200 L80,140 L160,180 L260,100 L360,160 L480,80 L580,140 L680,60 L780,120 L860,50 L960,110 L1060,70 L1160,130 L1280,90 L1380,150 L1440,120 L1440,300 Z"
          fill="rgba(20,10,40,0.5)" />
        <path d="M0,300 L0,240 L100,190 L200,220 L320,150 L420,200 L540,130 L660,190 L760,110 L880,170 L1000,140 L1100,200 L1200,160 L1300,210 L1440,180 L1440,300 Z"
          fill="rgba(10,5,25,0.65)" />
        <path d="M0,300 L0,270 L150,230 L280,260 L400,200 L520,250 L640,185 L760,245 L900,195 L1020,250 L1150,215 L1280,260 L1440,235 L1440,300 Z"
          fill="rgba(5,3,15,0.85)" />
      </svg>
    </div>
  );
}

// Ambient glow
function AmbientGlow() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <motion.div
        style={{
          position: 'absolute', top: '15%', left: '30%', width: '40%', height: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(120,40,200,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', top: '25%', right: '20%', width: '30%', height: '25%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(30,80,200,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
      />
      <div style={{
        position: 'absolute', bottom: '15%', left: '35%', width: '30%', height: '10%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(180,80,20,0.06) 0%, transparent 70%)',
        filter: 'blur(30px)',
      }} />
    </div>
  );
}

// Desktop context menu items (stable reference outside component)
const buildContextMenuItems = (
  showContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void,
  selectIcon: (id: string | null) => void
) => (e: React.MouseEvent) => {
  e.preventDefault();
  selectIcon(null);
  showContextMenu(e.clientX, e.clientY, [
    { id: 'terminal', label: 'Open Terminal', icon: 'Terminal', action: () => console.log('Opening Terminal') },
    { id: 'new-folder', label: 'New Folder', icon: 'FolderPlus', action: () => console.log('New Folder (placeholder)') },
    { id: 'new-file', label: 'New Text File', icon: 'FilePlus', action: () => console.log('New Text File (placeholder)') },
    { id: 'refresh', label: 'Refresh', icon: 'RefreshCw', separator: true, action: () => window.location.reload() },
    { id: 'display', label: 'Display Settings', icon: 'Monitor', action: () => console.log('Display Settings (placeholder)') },
    { id: 'personalize', label: 'Personalize', icon: 'Palette', action: () => console.log('Personalize (placeholder)') },
  ]);
};

export default function Desktop() {
  const selectIcon = useOSStore((s) => s.selectIcon);
  const hideContextMenu = useOSStore((s) => s.hideContextMenu);
  const showContextMenu = useOSStore((s) => s.showContextMenu);

  // Use fine-grained selectors to avoid re-rendering on every fsStore change
  const nodes = useFileSystemStore((s) => s.nodes);
  const showHidden = useFileSystemStore((s) => s.showHidden);

  const icons = React.useMemo(() => {
    const desktopNode = Object.values(nodes).find(n => n.path === '/home/vansh/Desktop');
    if (!desktopNode) return [];
    return Object.values(nodes).filter(
      n => n.parentId === desktopNode.id && (!n.hidden || showHidden)
    );
  }, [nodes, showHidden]);

  const handleDesktopClick = React.useCallback(() => {
    selectIcon(null);
    hideContextMenu();
  }, [selectIcon, hideContextMenu]);

  const handleContextMenu = React.useMemo(
    () => buildContextMenuItems(showContextMenu, selectIcon),
    [showContextMenu, selectIcon]
  );

  return (
    <motion.div
      className="fixed inset-0"
      style={{ top: 28 }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={wallpaperStyle} />
      <Stars />
      <AmbientGlow />
      <MountainSilhouette />

      {/* Center watermark */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none', userSelect: 'none',
      }}>
        <div style={{
          fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700,
          letterSpacing: '0.25em', color: 'rgba(167,139,250,0.08)',
          fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1,
        }}>
          VNX.OS
        </div>
        <div style={{
          marginTop: 8, fontSize: 'clamp(10px, 1.2vw, 14px)',
          letterSpacing: '0.4em', color: 'rgba(148,163,184,0.05)',
          fontWeight: 300, textTransform: 'uppercase',
        }}>
          IDEAS &gt; CODE &gt; IMPACT
        </div>
      </div>

      {/* Desktop Icons */}
      <div
        style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
      </div>
    </motion.div>
  );
}
