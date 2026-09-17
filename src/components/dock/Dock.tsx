import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { dockItems } from '../../data/dockItems';
import { useOSStore } from '../../store/osStore';
import { getApp } from '../../data/apps';

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
  onLaunch?: () => void;
}

function DockItemComponent({ id, icon, label, appId, onLaunch }: DockItemComponentProps) {
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

  const handleClick = () => {
    if (id === 'launcher') {
      toggleLauncher();
      return;
    }
    if (onLaunch) {
      onLaunch();
      return;
    }
    if (appId) {
      if (isActive) {
        // App is already open
        if (isAllMinimized) {
          // Restore the first minimized one
          restoreWindow(activeWindows[0].id);
          focusWindow(activeWindows[0].id);
        } else if (isFocused) {
          // If focused, minimize it
          minimizeWindow(activeWindows.find(w => w.isFocused)!.id);
        } else {
          // Not focused, bring to front
          const visibleWin = activeWindows.find(w => w.state !== 'minimized');
          if (visibleWin) focusWindow(visibleWin.id);
        }
        return;
      }

      const app = getApp(appId);
      if (app) {
        console.log(`Dock: Opening ${app.name}`);
        openWindow(app);
      } else {
        console.log(`Dock: App "${appId}" not yet implemented`);
      }
    }
  };

  return (
    <div
      className="dock-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
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
          width: 44,
          height: 44,
          borderRadius: 12,
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
        <LucideIcon name={icon} size={20} />
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
  return (
    <div
      className="fixed bottom-3 left-1/2 z-40"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        className="glass-dock"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {dockItems.map((item, idx) => {
          // Add separator before trash
          const showSep = item.id === 'trash';
          return (
            <React.Fragment key={item.id}>
              {showSep && (
                <div
                  style={{
                    width: 1,
                    height: 28,
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
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
