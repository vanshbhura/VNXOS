import { useEffect } from 'react';
import { useOSStore } from '../store/osStore';
import { useSettingsStore } from '../store/settingsStore';
import { useEasterEggStore } from '../features/easter-eggs/easterEggStore';

export function useKeyboardShortcuts() {
  // Use individual selectors — object-returning selectors create a new reference each render
  // and cause an infinite loop with React 18's useSyncExternalStore.
  const windows = useOSStore(s => s.windows);
  const focusWindow = useOSStore(s => s.focusWindow);
  const closeWindow = useOSStore(s => s.closeWindow);
  const maximizeWindow = useOSStore(s => s.maximizeWindow);
  const restoreWindow = useOSStore(s => s.restoreWindow);
  const toggleLauncher = useOSStore(s => s.toggleLauncher);
  const hideContextMenu = useOSStore(s => s.hideContextMenu);
  const setLauncherOpen = useOSStore(s => s.setLauncherOpen);

  const setActiveOverlay = useSettingsStore(s => s.setActiveOverlay);
  const activeOverlay = useSettingsStore(s => s.activeOverlay);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape -> close overlays & context menu & launcher & easter egg modals
      if (e.key === 'Escape') {
        hideContextMenu();
        setLauncherOpen(false);
        if (activeOverlay !== 'none') {
          setActiveOverlay('none');
        }
        useEasterEggStore.getState().closeDevModal();
        useEasterEggStore.getState().setDevModeOverlay(false);
      }

      // Alt + D or Ctrl + Shift + D -> toggle Developer Mode HUD
      if ((e.altKey && e.key.toLowerCase() === 'd') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        useEasterEggStore.getState().toggleDevModeOverlay();
      }

      // Meta / Super alone -> toggle launcher
      if (e.key === 'Meta' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
        toggleLauncher();
      }

      // Meta+Space OR Ctrl+Space -> global search
      if (e.key === ' ' && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setActiveOverlay(activeOverlay === 'global-search' ? 'none' : 'global-search');
        setLauncherOpen(false);
      }

      // Alt + Tab -> cycle through active windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const activeWindows = windows.filter(w => w.state !== 'minimized');
        if (activeWindows.length > 1) {
          const currentIndex = activeWindows.findIndex(w => w.isFocused);
          const nextIndex = e.shiftKey
            ? (currentIndex - 1 + activeWindows.length) % activeWindows.length
            : (currentIndex + 1) % activeWindows.length;
          focusWindow(activeWindows[nextIndex].id);
        } else if (activeWindows.length === 1 && !activeWindows[0].isFocused) {
          focusWindow(activeWindows[0].id);
        }
      }

      // Alt + F4 -> close focused window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        const focused = windows.find(w => w.isFocused);
        if (focused) closeWindow(focused.id);
      }

      // Alt + F10 -> toggle maximize focused window
      if (e.altKey && e.key === 'F10') {
        e.preventDefault();
        const focused = windows.find(w => w.isFocused);
        if (focused) {
          if (focused.state === 'maximized') restoreWindow(focused.id);
          else maximizeWindow(focused.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    windows, focusWindow, closeWindow, maximizeWindow, restoreWindow,
    hideContextMenu, setLauncherOpen, toggleLauncher,
    setActiveOverlay, activeOverlay,
  ]);
}
