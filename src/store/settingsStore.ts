import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WallpaperKey = 'aurora' | 'cyberpunk' | 'matrix' | 'sunset' | 'slate' | 'light';
export type ThemeKey = 'dark' | 'light' | 'high-contrast';
export type PowerState = 'running' | 'locked' | 'sleeping' | 'shutdown';
export type ActiveOverlay =
  | 'none'
  | 'quick-settings'
  | 'notifications'
  | 'calendar'
  | 'user-menu'
  | 'global-search';

export interface VNXNotification {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: number;
  read: boolean;
  icon?: string;
}

export interface RecentItem {
  id: string;
  title: string;
  type: 'app' | 'file' | 'project';
  icon: string;
  appId?: string;
  path?: string;
  timestamp: number;
}

export interface DockSettings {
  visible: boolean;
  autoHide: boolean;
  iconSize: number;
  position: 'bottom' | 'left' | 'right';
}

export interface DesktopIconSettings {
  visible: boolean;
  size: 'small' | 'medium' | 'large';
  gridSnap: boolean;
}

export interface WindowSettings {
  animations: boolean;
  snap: boolean;
  rememberPositions: boolean;
}

export interface SimulatedWifi {
  connected: boolean;
  networkName: string;
  strength: number;
}

export interface SimulatedVolume {
  level: number;
  muted: boolean;
}

export interface SimulatedBattery {
  level: number;
  charging: boolean;
}

export interface SettingsState {
  theme: ThemeKey;
  wallpaper: WallpaperKey;
  dockSettings: DockSettings;
  desktopIconSettings: DesktopIconSettings;
  windowSettings: WindowSettings;
  simulatedWifi: SimulatedWifi;
  simulatedVolume: SimulatedVolume;
  simulatedBrightness: number;
  simulatedBattery: SimulatedBattery;
  powerState: PowerState;
  activeOverlay: ActiveOverlay;
  notifications: VNXNotification[];
  recentItems: RecentItem[];
  favoriteAppIds: string[];
}

export interface SettingsActions {
  setTheme: (theme: ThemeKey) => void;
  setWallpaper: (wallpaper: WallpaperKey) => void;
  updateDockSettings: (settings: Partial<DockSettings>) => void;
  updateDesktopIconSettings: (settings: Partial<DesktopIconSettings>) => void;
  updateWindowSettings: (settings: Partial<WindowSettings>) => void;
  setWifi: (wifi: Partial<SimulatedWifi>) => void;
  setVolume: (volume: Partial<SimulatedVolume>) => void;
  setBrightness: (brightness: number) => void;
  setBattery: (battery: Partial<SimulatedBattery>) => void;
  setPowerState: (state: PowerState) => void;
  setActiveOverlay: (overlay: ActiveOverlay) => void;
  toggleOverlay: (overlay: ActiveOverlay) => void;
  addNotification: (notification: Omit<VNXNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addRecentItem: (item: Omit<RecentItem, 'id' | 'timestamp'>) => void;
  toggleFavoriteApp: (appId: string) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

// ─── Persistence ──────────────────────────────────────────────────────────────

const SETTINGS_KEY = 'vnxos.settings.v1';

const defaultSettings: SettingsState = {
  theme: 'dark',
  wallpaper: 'aurora',
  dockSettings: {
    visible: true,
    autoHide: false,
    iconSize: 44,
    position: 'bottom',
  },
  desktopIconSettings: {
    visible: true,
    size: 'medium',
    gridSnap: false,
  },
  windowSettings: {
    animations: true,
    snap: true,
    rememberPositions: true,
  },
  simulatedWifi: {
    connected: true,
    networkName: 'VNX-Network',
    strength: 3,
  },
  simulatedVolume: {
    level: 70,
    muted: false,
  },
  simulatedBrightness: 90,
  simulatedBattery: {
    level: 87,
    charging: true,
  },
  powerState: 'running',
  activeOverlay: 'none',
  notifications: [
    {
      id: 'notif-welcome',
      title: 'Welcome to VNX.OS',
      message: 'Explore the portfolio by clicking desktop icons or using the App Launcher.',
      source: 'System',
      timestamp: Date.now() - 60000,
      read: false,
      icon: 'Cpu',
    },
    {
      id: 'notif-terminal',
      title: 'Terminal Ready',
      message: "Open a terminal and run `help` to see all available commands.",
      source: 'Terminal',
      timestamp: Date.now() - 30000,
      read: false,
      icon: 'Terminal',
    },
  ],
  recentItems: [],
  favoriteAppIds: ['projects', 'about', 'terminal', 'file-manager'],
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SettingsState>;
      return {
        ...defaultSettings,
        ...parsed,
        dockSettings: { ...defaultSettings.dockSettings, ...parsed.dockSettings },
        desktopIconSettings: { ...defaultSettings.desktopIconSettings, ...parsed.desktopIconSettings },
        windowSettings: { ...defaultSettings.windowSettings, ...parsed.windowSettings },
        simulatedWifi: { ...defaultSettings.simulatedWifi, ...parsed.simulatedWifi },
        simulatedVolume: { ...defaultSettings.simulatedVolume, ...parsed.simulatedVolume },
        simulatedBattery: { ...defaultSettings.simulatedBattery, ...parsed.simulatedBattery },
        powerState: 'running',
        activeOverlay: 'none',
        notifications: parsed.notifications ?? defaultSettings.notifications,
        recentItems: parsed.recentItems ?? defaultSettings.recentItems,
        favoriteAppIds: parsed.favoriteAppIds ?? defaultSettings.favoriteAppIds,
      };
    }
  } catch {
    // ignore
  }
  return { ...defaultSettings };
}

function saveSettings(state: SettingsState) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { powerState: _p, activeOverlay: _o, ...toSave } = state;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsStore>()((set, get) => ({
  ...loadSettings(),

  setTheme: (theme) => { set({ theme }); saveSettings({ ...get(), theme }); },
  setWallpaper: (wallpaper) => { set({ wallpaper }); saveSettings({ ...get(), wallpaper }); },

  updateDockSettings: (settings) => {
    const dockSettings = { ...get().dockSettings, ...settings };
    set({ dockSettings });
    saveSettings({ ...get(), dockSettings });
  },

  updateDesktopIconSettings: (settings) => {
    const desktopIconSettings = { ...get().desktopIconSettings, ...settings };
    set({ desktopIconSettings });
    saveSettings({ ...get(), desktopIconSettings });
  },

  updateWindowSettings: (settings) => {
    const windowSettings = { ...get().windowSettings, ...settings };
    set({ windowSettings });
    saveSettings({ ...get(), windowSettings });
  },

  setWifi: (wifi) => {
    const simulatedWifi = { ...get().simulatedWifi, ...wifi };
    set({ simulatedWifi });
    saveSettings({ ...get(), simulatedWifi });
  },

  setVolume: (volume) => {
    const simulatedVolume = { ...get().simulatedVolume, ...volume };
    set({ simulatedVolume });
    saveSettings({ ...get(), simulatedVolume });
  },

  setBrightness: (simulatedBrightness) => {
    set({ simulatedBrightness });
    saveSettings({ ...get(), simulatedBrightness });
  },

  setBattery: (battery) => {
    const simulatedBattery = { ...get().simulatedBattery, ...battery };
    set({ simulatedBattery });
    saveSettings({ ...get(), simulatedBattery });
  },

  setPowerState: (powerState) => { set({ powerState }); },

  setActiveOverlay: (activeOverlay) => { set({ activeOverlay }); },

  toggleOverlay: (overlay) => {
    const current = get().activeOverlay;
    set({ activeOverlay: current === overlay ? 'none' : overlay });
  },

  addNotification: (notification) => {
    const newNotif: VNXNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      read: false,
    };
    const notifications = [newNotif, ...get().notifications].slice(0, 50);
    set({ notifications });
    saveSettings({ ...get(), notifications });
  },

  markNotificationRead: (id) => {
    const notifications = get().notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    set({ notifications });
    saveSettings({ ...get(), notifications });
  },

  dismissNotification: (id) => {
    const notifications = get().notifications.filter((n) => n.id !== id);
    set({ notifications });
    saveSettings({ ...get(), notifications });
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
    saveSettings({ ...get(), notifications: [] });
  },

  addRecentItem: (item) => {
    const existing = get().recentItems.filter(
      (r) => !(r.appId === item.appId && r.path === item.path)
    );
    const newItem: RecentItem = { ...item, id: `recent-${Date.now()}`, timestamp: Date.now() };
    const recentItems = [newItem, ...existing].slice(0, 20);
    set({ recentItems });
    saveSettings({ ...get(), recentItems });
  },

  toggleFavoriteApp: (appId) => {
    const current = get().favoriteAppIds;
    const favoriteAppIds = current.includes(appId)
      ? current.filter((id) => id !== appId)
      : [...current, appId];
    set({ favoriteAppIds });
    saveSettings({ ...get(), favoriteAppIds });
  },
}));
