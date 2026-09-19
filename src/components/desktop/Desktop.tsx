import React from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../store/osStore';
import { useFileSystemStore } from '../../store/fsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getWallpaper } from '../../data/wallpapers';
import DesktopIcon from '../icons/DesktopIcon';
import type { ContextMenuItem } from '../../types/os';
import { getApp } from '../../data/apps';


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

// Simulated refresh — re-renders desktop state without page reload
let _desktopRefreshCounter = 0;
function useDesktopRefresh() {
  const [, setCounter] = React.useState(0);
  return React.useCallback(() => {
    _desktopRefreshCounter++;
    setCounter(_desktopRefreshCounter);
  }, []);
}

export default function Desktop() {
  const selectIcon = useOSStore((s) => s.selectIcon);
  const hideContextMenu = useOSStore((s) => s.hideContextMenu);
  const showContextMenu = useOSStore((s) => s.showContextMenu);
  const openWindow = useOSStore((s) => s.openWindow);

  const nodes = useFileSystemStore((s) => s.nodes);
  const showHidden = useFileSystemStore((s) => s.showHidden);
  const createFolder = useFileSystemStore((s) => s.createFolder);

  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const desktopIconSettings = useSettingsStore((s) => s.desktopIconSettings);
  const setActiveOverlay = useSettingsStore((s) => s.setActiveOverlay);

  const refreshDesktop = useDesktopRefresh();
  const wallpaperPreset = React.useMemo(() => getWallpaper(wallpaper), [wallpaper]);

  const openWin = React.useCallback((appId: string) => {
    const app = getApp(appId);
    if (app) openWindow(app);
  }, [openWindow]);

  const openSearch = React.useCallback(() => setActiveOverlay('global-search'), [setActiveOverlay]);

  const desktopNode = React.useMemo(
    () => Object.values(nodes).find(n => n.path === '/home/vansh/Desktop'),
    [nodes]
  );

  const icons = React.useMemo(() => {
    if (!desktopNode) return [];
    return Object.values(nodes).filter(
      n => n.parentId === desktopNode.id && (!n.hidden || showHidden)
    );
  }, [nodes, showHidden, desktopNode]);

  // Icon size scale
  const iconScale = desktopIconSettings.size === 'small' ? 0.75
    : desktopIconSettings.size === 'large' ? 1.3
    : 1.0;

  const handleDesktopClick = React.useCallback(() => {
    selectIcon(null);
    hideContextMenu();
  }, [selectIcon, hideContextMenu]);

  const handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    selectIcon(null);

    const items: ContextMenuItem[] = [
      {
        id: 'terminal',
        label: 'Open Terminal',
        icon: 'Terminal',
        action: () => openWin('terminal'),
      },
      {
        id: 'new-folder',
        label: 'New Folder',
        icon: 'FolderPlus',
        action: () => {
          if (desktopNode) {
            const name = `New Folder`;
            createFolder(name, desktopNode.id);
          }
        },
      },
      {
        id: 'new-file',
        label: 'New Text File',
        icon: 'FilePlus',
        action: () => openWin('notes'),
      },
      {
        id: 'search',
        label: 'Global Search',
        icon: 'Search',
        separator: true,
        action: openSearch,
      },
      {
        id: 'wallpaper',
        label: 'Change Wallpaper',
        icon: 'Image',
        action: () => openWin('settings'),
      },
      {
        id: 'settings',
        label: 'Display Settings',
        icon: 'Monitor',
        action: () => openWin('settings'),
      },
      {
        id: 'sort-by',
        label: 'Sort By Name',
        icon: 'ArrowUpDown',
        separator: true,
        action: () => {
          // Cosmetic — icons are sorted by filesystem; refresh to re-render
          refreshDesktop();
        },
      },
      {
        id: 'refresh',
        label: 'Refresh Desktop',
        icon: 'RefreshCw',
        action: () => {
          refreshDesktop();
        },
      },
      {
        id: 'reset-desktop',
        label: 'Reset Desktop',
        icon: 'RotateCcw',
        separator: true,
        action: () => {
          try {
            localStorage.removeItem('vnx_app_states');
          } catch {
            // ignore
          }
          refreshDesktop();
        },
      },
    ];

    showContextMenu(e.clientX, e.clientY, items);
  }, [showContextMenu, selectIcon, openWin, openSearch, desktopNode, createFolder, refreshDesktop]);

  const wallpaperStyle: React.CSSProperties = { position: 'absolute', inset: 0, background: wallpaperPreset.background };

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
      {desktopIconSettings.visible && (
        <div
          style={{
            position: 'absolute', top: 16, left: 16,
            display: 'flex', flexDirection: 'column', gap: 4,
            transform: `scale(${iconScale})`,
            transformOrigin: 'top left',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {icons.map((icon) => (
            <DesktopIcon key={icon.id} icon={icon} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
