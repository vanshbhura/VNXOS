// ─── Window / Application types ───────────────────────────────────────────────

export type WindowState = 'normal' | 'minimized' | 'maximized';

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type WindowSnapState = 'none' | 'left' | 'right' | 'top' | 'maximized';

export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  icon: string;
  state: WindowState;
  snapState?: WindowSnapState;
  rect: WindowRect;
  previousRect?: WindowRect; // To restore from maximize/snap
  zIndex: number;
  isFocused: boolean;
  isResizable: boolean;
  initialPath?: string;
}

// ─── Desktop Icon types ────────────────────────────────────────────────────────

export type DesktopIconType = 'folder' | 'file' | 'app' | 'link';

export interface DesktopIconDef {
  id: string;
  label: string;
  icon: string;
  iconColor?: string;
  type: DesktopIconType;
  appId?: string;
  href?: string;
}

// ─── Application Registry types ───────────────────────────────────────────────

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  description?: string;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  component?: string;
  allowMultiple?: boolean;
}

// ─── Dock types ───────────────────────────────────────────────────────────────

export interface DockItemDef {
  id: string;
  label: string;
  icon: string;
  appId?: string;
  href?: string;
  isSeparator?: boolean;
}

// ─── Context Menu types ───────────────────────────────────────────────────────

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

// Flat context menu state — avoids nested object reference churn in Zustand
export interface ContextMenuState {
  cmVisible: boolean;
  cmX: number;
  cmY: number;
  cmItems: ContextMenuItem[];
}

// ─── OS Store types ───────────────────────────────────────────────────────────

export interface OSState extends ContextMenuState {
  selectedIconId: string | null;
  windows: AppWindow[];
  nextZIndex: number;
  isDockVisible: boolean;
  isLauncherOpen: boolean;
  bootComplete: boolean;
}

export interface OSActions {
  selectIcon: (id: string | null) => void;
  openWindow: (app: AppDefinition, initialRect?: Partial<WindowRect>, initialPath?: string, forceNew?: boolean) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, rect: Partial<WindowRect>) => void;
  toggleLauncher: () => void;
  setLauncherOpen: (open: boolean) => void;
  showContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  hideContextMenu: () => void;
  setBootComplete: (v: boolean) => void;
}

export type OSStore = OSState & OSActions;
