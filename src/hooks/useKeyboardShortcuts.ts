import { useEffect } from 'react';
import { useOSStore } from '../store/osStore';
import { useSettingsStore } from '../store/settingsStore';

export function useKeyboardShortcuts() {
  // Use individual selectors — object-returning selectors create a new reference each render
  // and cause an infinite loop with React 18's useSyncExternalStore.
  const windows = useOSStore(s => s.windows);
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
      // Escape -> close overlays & context menu & launcher
      if (e.key === 'Escape') {
        hideContextMenu();
        setLauncherOpen(false);
        if (activeOverlay !== 'none') {
          setActiveOverlay('none');
        }
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
    windows, closeWindow, maximizeWindow, restoreWindow,
    hideContextMenu, setLauncherOpen, toggleLauncher,
    setActiveOverlay, activeOverlay,
  ]);
}
