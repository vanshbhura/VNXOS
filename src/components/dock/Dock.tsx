import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { dockItems } from '../../data/dockItems';
import { useOSStore } from '../../store/osStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getApp } from '../../data/apps';
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL, openExternalLink } from '../../data/socialLinks';

function LucideIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} />;
  return <Icon size={size} />;
}

interface DockItemComponentProps {
  id: string;
  icon: string;
  label: string;
  appId?: string;
  iconSize: number;
}

function DockItemComponent({ id, icon, label, appId, iconSize }: DockItemComponentProps) {
  const [hovered, setHovered] = useState(false);
  const openWindow = useOSStore((s) => s.openWindow);
  const toggleLauncher = useOSStore((s) => s.toggleLauncher);
  const windows = useOSStore((s) => s.windows);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const restoreWindow = useOSStore((s) => s.restoreWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);

  const activeWindows = windows.filter(w => w.appId === appId);
  const isActive = activeWindows.length > 0;
  const isFocused = activeWindows.some(w => w.isFocused);
  const isAllMinimized = activeWindows.length > 0 && activeWindows.every(w => w.state === 'minimized');

  const iconPx = iconSize;
  const innerIconPx = Math.round(iconSize * 0.5);

  const handleClick = () => {
    if (id === 'launcher') {
      toggleLauncher();
      return;
    }
    if (appId) {
      if (appId === 'github') {
        openExternalLink(GITHUB_PROFILE_URL);
        return;
      }
      if (appId === 'linkedin') {
        openExternalLink(LINKEDIN_PROFILE_URL);
        return;
      }

      if (isActive) {
        if (isAllMinimized) {
          restoreWindow(activeWindows[0].id);
          focusWindow(activeWindows[0].id);
        } else if (isFocused) {
          minimizeWindow(activeWindows.find(w => w.isFocused)!.id);
        } else {
          const visibleWin = activeWindows.find(w => w.state !== 'minimized');
          if (visibleWin) focusWindow(visibleWin.id);
        }
        return;
      }

      const app = getApp(appId);
      if (app) {
        openWindow(app);
      }
    }
  };

  return (
    <div
      className="dock-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 10px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 15, 30, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              color: '#e2e8f0',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 200,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon container */}
      <motion.div
        animate={{ scale: hovered ? 1.25 : 1, y: hovered ? -6 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{
          width: iconPx,
          height: iconPx,
          borderRadius: Math.round(iconPx * 0.27),
          background: id === 'launcher'
            ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(37,99,235,0.5))'
            : 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: id === 'launcher' ? '#c4b5fd' : 'rgba(226,232,240,0.8)',
          cursor: 'pointer',
          transition: 'background 0.15s ease, border-color 0.15s ease',
          boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <LucideIcon name={icon} size={innerIconPx} />
      </motion.div>

      {/* Active Indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: -4,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: isFocused ? 'rgba(226, 232, 240, 0.9)' : 'rgba(148, 163, 184, 0.5)',
              boxShadow: isFocused ? '0 0 4px rgba(255,255,255,0.4)' : 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dock() {
  const dockSettings = useSettingsStore((s) => s.dockSettings);
  const { visible, autoHide, iconSize, position } = dockSettings;

  const [isAutoHideVisible, setIsAutoHideVisible] = useState(false);

  if (!visible) return null;

  const positionStyles: React.CSSProperties = position === 'bottom'
    ? { bottom: 12, left: '50%', transform: 'translateX(-50%)', flexDirection: 'row' }
    : position === 'left'
    ? { left: 8, top: '50%', transform: 'translateY(-50%)', flexDirection: 'column' }
    : { right: 8, top: '50%', transform: 'translateY(-50%)', flexDirection: 'column' };

  // Auto-hide: dock is only visible on hover near its edge
  const autoHideStyle: React.CSSProperties = autoHide
    ? {
        opacity: isAutoHideVisible ? 1 : 0,
        transform: position === 'bottom'
          ? `translateX(-50%) translateY(${isAutoHideVisible ? 0 : 80}px)`
          : position === 'left'
          ? `translateY(-50%) translateX(${isAutoHideVisible ? 0 : -80}px)`
          : `translateY(-50%) translateX(${isAutoHideVisible ? 0 : 80}px)`,
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: isAutoHideVisible ? 'auto' : 'none',
      }
    : {};

  // Auto-hide detector zone
  const triggerZone: React.CSSProperties = autoHide ? {
    position: 'fixed',
    ...(position === 'bottom' ? { bottom: 0, left: 0, right: 0, height: 8 } :
       position === 'left' ? { left: 0, top: 0, bottom: 0, width: 8 } :
       { right: 0, top: 0, bottom: 0, width: 8 }),
    zIndex: 8499,
  } : {};

  return (
    <>
      {/* Auto-hide trigger zone */}
      {autoHide && (
        <div
          style={triggerZone}
          onMouseEnter={() => setIsAutoHideVisible(true)}
          onMouseLeave={() => setIsAutoHideVisible(false)}
        />
      )}

      <div
        className="fixed"
        style={{
          zIndex: 8500,
          ...positionStyles,
          ...autoHideStyle,
        }}
        onMouseEnter={() => autoHide && setIsAutoHideVisible(true)}
        onMouseLeave={() => autoHide && setIsAutoHideVisible(false)}
      >
        <div
          className="glass-dock"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: position === 'bottom' ? 'row' : 'column',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {dockItems.map((item) => {
            const showSep = item.id === 'trash';
            return (
              <React.Fragment key={item.id}>
                {showSep && (
                  <div
                    style={{
                      width: position === 'bottom' ? 1 : '100%',
                      height: position === 'bottom' ? 28 : 1,
                      background: 'rgba(255,255,255,0.12)',
                      margin: '0 3px',
                    }}
                  />
                )}
                <DockItemComponent
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  appId={item.appId}
                  iconSize={iconSize}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}
