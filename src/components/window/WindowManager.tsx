import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { AppWindow, WindowSnapState } from '../../types/os';
import ErrorBoundary from '../ErrorBoundary';
import FileManager from '../apps/FileManager/FileManager';
import ResumeViewer from '../apps/ResumeViewer';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import CertificatesApp from '../apps/CertificatesApp';
import CertificationApp from '../apps/CertificationApp';
import ExperienceApp from '../apps/ExperienceApp';
import NotesApp from '../apps/NotesApp';
import ResourcesApp from '../apps/ResourcesApp';
import AIToolsApp from '../apps/AIToolsApp';
import GitHubApp from '../apps/GitHubApp';
import LinkedInApp from '../apps/LinkedInApp';
import TerminalView from '../apps/terminal/TerminalView';
import SettingsApp from '../apps/SettingsApp';

// Map of appId -> component to render inside the window
function AppContent({ win }: { win: AppWindow }) {
  switch (win.appId) {
    case 'terminal':
      return <TerminalView shell="bash" window={win} />;
    case 'cmd':
      return <TerminalView shell="cmd" window={win} />;
    case 'powershell':
      return <TerminalView shell="powershell" window={win} />;
    case 'file-manager':
      return <FileManager window={win} />;
    case 'trash':
      return <FileManager window={{ ...win, initialPath: win.initialPath || '/home/vansh/Trash' }} />;
    case 'resume':
      return <ResumeViewer />;
    case 'about':
      return <AboutApp />;
    case 'projects':
      return <ProjectsApp />;
    case 'certificates':
      return <CertificatesApp />;
    case 'certifications':
      return <CertificationApp />;
    case 'experience':
      return <ExperienceApp />;
    case 'notes':
      return <NotesApp />;
    case 'resources':
      return <ResourcesApp />;
    case 'ai-tools':
      return <AIToolsApp />;
    case 'github':
      return <GitHubApp />;
    case 'linkedin':
      return <LinkedInApp />;
    case 'settings':
      return <SettingsApp />;
    default:
      return null; // Falls through to the "Coming Soon" placeholder in WindowFrame
  }
}

function LucideIcon({ name, size = 14 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} />;
  return <Icon size={size} />;
}

interface WindowFrameProps {
  win: AppWindow;
  children?: React.ReactNode;
}

const MIN_WIDTH = 360;
const MIN_HEIGHT = 240;

function WindowFrame({ win, children }: WindowFrameProps) {
  const focusWindow = useOSStore((s) => s.focusWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const maximizeWindow = useOSStore((s) => s.maximizeWindow);
  const restoreWindow = useOSStore((s) => s.restoreWindow);
  const moveWindow = useOSStore((s) => s.moveWindow);
  const resizeWindow = useOSStore((s) => s.resizeWindow);
  const showContextMenu = useOSStore((s) => s.showContextMenu);
  const hideContextMenu = useOSStore((s) => s.hideContextMenu);

  const windowSettings = useSettingsStore((s) => s.windowSettings);
  const animationsOn = windowSettings.animations;
  const snapOn = windowSettings.snap;

  const [snapPreview, setSnapPreview] = useState<WindowSnapState>('none');
  const dragRef = React.useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = React.useRef<{ startX: number; startY: number; winX: number; winY: number; winW: number; winH: number; dir: string } | null>(null);

  const isMaximized = win.state === 'maximized' || win.snapState === 'maximized';

  // Context Menu for titlebar
  const handleTitleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    showContextMenu(e.clientX, e.clientY, [
      { id: 'restore', label: 'Restore', icon: 'Minimize2', disabled: win.state !== 'maximized' && win.snapState === 'none', action: () => restoreWindow(win.id) },
      { id: 'minimize', label: 'Minimize', icon: 'Minus', action: () => minimizeWindow(win.id) },
      { id: 'maximize', label: 'Maximize', icon: 'Maximize2', disabled: isMaximized, action: () => maximizeWindow(win.id) },
      { id: 'close', label: 'Close', icon: 'X', separator: true, action: () => closeWindow(win.id) },
    ]);
  };

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    focusWindow(win.id);
    hideContextMenu();
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.rect.x, winY: win.rect.y };

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      
      // Calculate snap preview (only if snap enabled)
      if (snapOn) {
        if (me.clientY <= 10) setSnapPreview('maximized');
        else if (me.clientX <= 10) setSnapPreview('left');
        else if (me.clientX >= window.innerWidth - 10) setSnapPreview('right');
        else setSnapPreview('none');
      }

      const dx = me.clientX - dragRef.current.startX;
      const dy = me.clientY - dragRef.current.startY;
      // Prevent dragging off top screen completely
      const newY = Math.max(28, dragRef.current.winY + dy);
      moveWindow(win.id, dragRef.current.winX + dx, newY);
    };

    const onUp = (_me: MouseEvent) => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      
      // Apply snap
      setSnapPreview((prev: WindowSnapState) => {
        if (!snapOn) return 'none';
        if (prev === 'maximized') maximizeWindow(win.id);
        else if (prev === 'left') {
          moveWindow(win.id, 0, 28);
          resizeWindow(win.id, { width: window.innerWidth / 2, height: window.innerHeight - 28 });
          useOSStore.setState(s => ({ windows: s.windows.map(w => w.id === win.id ? { ...w, snapState: 'left', previousRect: win.rect } : w) }));
        }
        else if (prev === 'right') {
          moveWindow(win.id, window.innerWidth / 2, 28);
          resizeWindow(win.id, { width: window.innerWidth / 2, height: window.innerHeight - 28 });
          useOSStore.setState(s => ({ windows: s.windows.map(w => w.id === win.id ? { ...w, snapState: 'right', previousRect: win.rect } : w) }));
        }
        return 'none';
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized) return;
    focusWindow(win.id);
    hideContextMenu();

    resizeRef.current = { startX: e.clientX, startY: e.clientY, winX: win.rect.x, winY: win.rect.y, winW: win.rect.width, winH: win.rect.height, dir };

    const onMove = (me: MouseEvent) => {
      if (!resizeRef.current) return;
      const { startX, startY, winX, winY, winW, winH, dir } = resizeRef.current;
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;

      let newX = winX, newY = winY, newW = winW, newH = winH;

      if (dir.includes('e')) newW = Math.max(MIN_WIDTH, winW + dx);
      if (dir.includes('s')) newH = Math.max(MIN_HEIGHT, winH + dy);
      if (dir.includes('w')) {
        const potentialW = winW - dx;
        if (potentialW >= MIN_WIDTH) {
          newW = potentialW;
          newX = winX + dx;
        }
      }
      if (dir.includes('n')) {
        const potentialH = winH - dy;
        if (potentialH >= MIN_HEIGHT && (winY + dy) >= 28) {
          newH = potentialH;
          newY = winY + dy;
        }
      }

      moveWindow(win.id, newX, newY);
      resizeWindow(win.id, { width: newW, height: newH });
      
      // If we resize, we clear any snap state
      if (win.snapState !== 'none') {
        useOSStore.setState(s => ({ windows: s.windows.map(w => w.id === win.id ? { ...w, snapState: 'none' } : w) }));
      }
    };

    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const style = isMaximized
    ? { top: 28, left: 0, width: '100%', height: 'calc(100vh - 28px)' }
    : { top: win.rect.y, left: win.rect.x, width: win.rect.width, height: win.rect.height };

  // Resizers mapping
  const resizers = [
    { dir: 'n', cursor: 'ns-resize', top: -4, left: 4, right: 4, height: 8 },
    { dir: 's', cursor: 'ns-resize', bottom: -4, left: 4, right: 4, height: 8 },
    { dir: 'e', cursor: 'ew-resize', top: 4, bottom: 4, right: -4, width: 8 },
    { dir: 'w', cursor: 'ew-resize', top: 4, bottom: 4, left: -4, width: 8 },
    { dir: 'nw', cursor: 'nwse-resize', top: -4, left: -4, width: 12, height: 12 },
    { dir: 'ne', cursor: 'nesw-resize', top: -4, right: -4, width: 12, height: 12 },
    { dir: 'sw', cursor: 'nesw-resize', bottom: -4, left: -4, width: 12, height: 12 },
    { dir: 'se', cursor: 'nwse-resize', bottom: -4, right: -4, width: 12, height: 12 },
  ];

  return (
    <>
      {/* Snap Preview Box */}
      <AnimatePresence>
        {snapPreview !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              zIndex: 9998,
              top: 28,
              left: snapPreview === 'right' ? '50%' : 0,
              width: snapPreview === 'maximized' ? '100%' : '50%',
              height: 'calc(100vh - 28px)',
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={animationsOn ? { opacity: 0, scale: 0.95, y: 10 } : false}
        animate={{ opacity: 1, scale: 1, y: 0, ...style }}
        exit={animationsOn ? { opacity: 0, scale: 0.95, y: 30 } : { opacity: 0 }}
        transition={animationsOn ? { type: 'spring', stiffness: 450, damping: 35, bounce: 0 } : { duration: 0 }}
        style={{
          position: 'fixed',
          zIndex: win.zIndex,
          background: 'rgba(10, 10, 20, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: win.isFocused
            ? '1px solid rgba(139, 92, 246, 0.3)'
            : '1px solid rgba(255,255,255,0.07)',
          borderRadius: isMaximized ? 0 : 10,
          overflow: 'hidden',
          boxShadow: win.isFocused
            ? '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.15)'
            : '0 10px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseDown={() => focusWindow(win.id)}
      >
        {/* Title bar */}
        <div
          onMouseDown={handleTitleMouseDown}
          onContextMenu={handleTitleContextMenu}
          onDoubleClick={() => isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
          style={{
            height: 36,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 8,
            background: win.isFocused
              ? 'rgba(139,92,246,0.08)'
              : 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            cursor: isMaximized ? 'default' : 'grab',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => closeWindow(win.id)}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Close"
            />
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => minimizeWindow(win.id)}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', border: 'none', cursor: 'pointer' }}
              title="Minimize"
            />
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', border: 'none', cursor: 'pointer' }}
              title={isMaximized ? 'Restore' : 'Maximize'}
            />
          </div>

          {/* Window title */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ color: 'rgba(148,163,184,0.6)' }}>
              <LucideIcon name={win.icon} size={13} />
            </span>
            <span style={{ fontSize: 12.5, color: win.isFocused ? 'rgba(226,232,240,0.9)' : 'rgba(148,163,184,0.5)', fontWeight: 500, letterSpacing: '0.01em' }}>
              {win.title}
            </span>
          </div>

          <div style={{ width: 42 }} />
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <ErrorBoundary label={win.title}>
            {AppContent({ win }) ?? (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(148,163,184,0.3)' }}>
                <LucideIcon name={win.icon} size={40} />
                <div style={{ fontSize: 14, color: 'rgba(148,163,184,0.4)' }}>{win.title} — Coming Soon</div>
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Resizers */}
        {!isMaximized && win.isResizable && resizers.map((r) => (
          <div
            key={r.dir}
            onMouseDown={(e) => handleResizeMouseDown(e, r.dir)}
            style={{
              position: 'absolute',
              cursor: r.cursor,
              top: r.top, bottom: r.bottom, left: r.left, right: r.right,
              width: r.width, height: r.height,
              zIndex: 10,
            }}
          />
        ))}
      </motion.div>
    </>
  );
}

export default function WindowManager() {
  const windows = useOSStore((s) => s.windows);

  return (
    <AnimatePresence>
      {windows
        .filter((w) => w.state !== 'minimized')
        .map((win) => (
          <WindowFrame key={win.id} win={win} />
        ))}
    </AnimatePresence>
  );
}
