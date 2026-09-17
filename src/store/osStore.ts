import { create } from 'zustand';
import type { OSStore, AppDefinition, WindowRect, ContextMenuItem, AppWindow } from '../types/os';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const APP_STATE_KEY = 'vnx_app_states';

function getPersistedRect(appId: string): Partial<WindowRect> | null {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data[appId]) return data[appId].rect;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function persistRect(appId: string, rect: WindowRect, maximized: boolean = false) {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[appId] = { rect, maximized };
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export const useOSStore = create<OSStore>()((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────────
  selectedIconId: null,
  windows: [],
  nextZIndex: 100,
  isDockVisible: true,
  isLauncherOpen: false,
  bootComplete: false,
  cmVisible: false,
  cmX: 0,
  cmY: 0,
  cmItems: [],

  // ── Icon ────────────────────────────────────────────────────────────────────
  selectIcon: (id) => set({ selectedIconId: id }),

  // ── Windows ──────────────────────────────────────────────────────────────────
  openWindow: (app: AppDefinition, initialRect?: Partial<WindowRect>, initialPath?: string, forceNew?: boolean) => {
    const { windows, nextZIndex } = get();
    if (!app.allowMultiple && !forceNew) {
      const existing = windows.find((w) => w.appId === app.id);
      if (existing) {
        if (existing.state === 'minimized') {
          set((s) => ({
            windows: s.windows.map((w) =>
              w.id === existing.id
                ? { ...w, state: 'normal' as const, isFocused: true, zIndex: s.nextZIndex }
                : { ...w, isFocused: false }
            ),
            nextZIndex: s.nextZIndex + 1,
          }));
        } else {
          get().focusWindow(existing.id);
        }
        return;
      }
    }
    const id = generateId();
    const viewW = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const viewH = typeof window !== 'undefined' ? window.innerHeight : 900;
    
    // Check local storage for persisted rect
    const persistedRect = getPersistedRect(app.id);
    
    const w = initialRect?.width ?? persistedRect?.width ?? app.defaultSize.width;
    const h = initialRect?.height ?? persistedRect?.height ?? app.defaultSize.height;
    
    let x = initialRect?.x ?? persistedRect?.x;
    let y = initialRect?.y ?? persistedRect?.y;

    if (x === undefined || y === undefined) {
      // Smart offset: find top-most window to offset from
      const activeWindows = windows.filter(w => w.state !== 'minimized');
      if (activeWindows.length > 0) {
        // Find highest z-index window
        const topWin = activeWindows.reduce((prev, curr) => (prev.zIndex > curr.zIndex ? prev : curr));
        x = topWin.rect.x + 30;
        y = topWin.rect.y + 30;
        
        // Prevent going off-screen
        if (x + w > viewW) x = Math.max(80, (viewW - w) / 2);
        if (y + h > viewH) y = Math.max(40, (viewH - h) / 2 - 30);
      } else {
        x = Math.max(80, (viewW - w) / 2);
        y = Math.max(40, (viewH - h) / 2 - 30);
      }
    }

    const title = initialPath
      ? (initialPath.split('/').filter(Boolean).pop() || app.name)
      : app.name;

    const newWindow: AppWindow = {
      id, appId: app.id, title, icon: app.icon,
      state: 'normal', rect: { x, y, width: w, height: h },
      zIndex: nextZIndex, isFocused: true, isResizable: true,
      snapState: 'none',
      initialPath,
    };

    set((s) => ({
      windows: [...s.windows.map((w) => ({ ...w, isFocused: false })), newWindow],
      nextZIndex: s.nextZIndex + 1,
    }));
  },

  closeWindow: (id) => {
    // Persist position before closing
    const win = get().windows.find((w) => w.id === id);
    if (win) {
      persistRect(win.appId, win.state === 'maximized' && win.previousRect ? win.previousRect : win.rect, win.state === 'maximized');
    }
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }));
  },

  focusWindow: (id) =>
    set((s) => {
      // If already focused, don't increment z-index to avoid arbitrary huge numbers
      const target = s.windows.find(w => w.id === id);
      if (target?.isFocused) return s;

      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, isFocused: true, zIndex: s.nextZIndex } : { ...w, isFocused: false }
        ),
        nextZIndex: s.nextZIndex + 1,
      };
    }),

  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, state: 'minimized' as const, isFocused: false } : w
      ),
    })),

  maximizeWindow: (id) =>
    set((s) => ({ 
      windows: s.windows.map((w) => 
        w.id === id 
        ? { ...w, state: 'maximized' as const, previousRect: w.rect, snapState: 'maximized' } 
        : w
      ) 
    })),

  restoreWindow: (id) =>
    set((s) => ({ 
      windows: s.windows.map((w) => 
        w.id === id 
        ? { ...w, state: 'normal' as const, snapState: 'none', rect: w.previousRect ?? w.rect } 
        : w
      ) 
    })),

  moveWindow: (id, x, y) =>
    set((s) => ({ 
      windows: s.windows.map((w) => 
        w.id === id 
        ? { ...w, rect: { ...w.rect, x, y }, snapState: 'none', state: 'normal' as const } 
        : w
      ) 
    })),

  resizeWindow: (id, rect) =>
    set((s) => ({ 
      windows: s.windows.map((w) => 
        w.id === id 
        ? { ...w, rect: { ...w.rect, ...rect }, snapState: 'none', state: 'normal' as const } 
        : w
      ) 
    })),

  // ── Launcher ────────────────────────────────────────────────────────────────
  toggleLauncher: () => set((s) => ({ isLauncherOpen: !s.isLauncherOpen })),
  setLauncherOpen: (open) => set({ isLauncherOpen: open }),

  // ── Context menu (flat) ──────────────────────────────────────────────────────
  showContextMenu: (x: number, y: number, items: ContextMenuItem[]) =>
    set({ cmVisible: true, cmX: x, cmY: y, cmItems: items }),

  hideContextMenu: () => set({ cmVisible: false }),

  // ── Boot ────────────────────────────────────────────────────────────────────
  setBootComplete: (v) => set({ bootComplete: v }),
}));
