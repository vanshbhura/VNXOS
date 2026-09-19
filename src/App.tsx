import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootScreen, { BOOT_KEY } from './components/desktop/BootScreen';
import TopBar from './components/taskbar/TopBar';
import Desktop from './components/desktop/Desktop';
import Dock from './components/dock/Dock';
import AppLauncher from './components/apps/AppLauncher';
import ContextMenu from './components/desktop/ContextMenu';
import WindowManager from './components/window/WindowManager';
import TaskSwitcher from './components/window/TaskSwitcher';
import MobileFallback from './components/desktop/MobileFallback';
import PowerOverlays from './components/desktop/PowerOverlays';
import GlobalSearch from './components/desktop/GlobalSearch';
import { useOSStore } from './store/osStore';
import { useSettingsStore } from './store/settingsStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const setBootComplete = useOSStore((s) => s.setBootComplete);
  const theme = useSettingsStore((s) => s.theme);
  const isMobile = useIsMobile();
  useKeyboardShortcuts();

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
    setBootDone(true);
  }, [setBootComplete]);

  // Dev utility: expose boot reset to console
  useEffect(() => {
    (window as Window & { vnxResetBoot?: () => void }).vnxResetBoot = () => {
      localStorage.removeItem(BOOT_KEY);
      console.log('[VNX.OS] Boot flag cleared. Refresh to see boot sequence again.');
    };
    console.log(
      '%c VNX.OS %c Loaded. Run %cvnxResetBoot()%c in console to replay boot sequence.',
      'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:4px;font-weight:bold',
      'color:#94a3b8',
      'color:#a78bfa;font-family:monospace',
      'color:#94a3b8'
    );
  }, []);

  if (isMobile) return <MobileFallback />;

  return (
    <div
      data-theme={theme}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--os-bg, #070710)',
        position: 'relative',
      }}
    >
      <AnimatePresence>
        {!bootDone && (
          <BootScreen key="boot" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {bootDone && (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {/* Render order = visual z-stack (bottom → top) */}
          <Desktop />
          <ErrorBoundary label="Window Manager">
            <WindowManager />
          </ErrorBoundary>
          <TopBar />
          <Dock />
          <AppLauncher />
          <ContextMenu />
          <TaskSwitcher />
          <ErrorBoundary label="Global Search">
            <GlobalSearch />
          </ErrorBoundary>
          <ErrorBoundary label="Power Overlays">
            <PowerOverlays />
          </ErrorBoundary>
        </motion.div>
      )}
    </div>
  );
}
