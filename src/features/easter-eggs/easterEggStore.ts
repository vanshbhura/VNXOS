import { create } from 'zustand';
import { useSettingsStore } from '../../store/settingsStore';

interface EasterEggState {
  konamiActive: boolean;
  lastKonamiTrigger: number;
  isDevModalOpen: boolean;
  isDevModeOverlayOpen: boolean;
  desktopRippleActive: boolean;

  // Actions
  triggerKonami: () => boolean;
  setKonamiActive: (active: boolean) => void;
  openDevModal: () => void;
  closeDevModal: () => void;
  toggleDevModeOverlay: () => void;
  setDevModeOverlay: (open: boolean) => void;
  triggerDesktopSecret: () => void;
}

const KONAMI_COOLDOWN_MS = 6000;
const DESKTOP_SECRET_COOLDOWN_MS = 4000;

let lastDesktopSecretTime = 0;

export const useEasterEggStore = create<EasterEggState>((set, get) => ({
  konamiActive: false,
  lastKonamiTrigger: 0,
  isDevModalOpen: false,
  isDevModeOverlayOpen: false,
  desktopRippleActive: false,

  triggerKonami: () => {
    const now = Date.now();
    const last = get().lastKonamiTrigger;

    if (now - last < KONAMI_COOLDOWN_MS) {
      return false;
    }

    set({
      konamiActive: true,
      lastKonamiTrigger: now,
    });

    // Reuse existing notification store
    try {
      useSettingsStore.getState().addNotification({
        title: 'Konami Code Activated',
        message: 'Developer cheat sequence recognized! 30 extra lives granted to kernel memory.',
        source: 'Kernel',
        icon: 'Gamepad2',
      });
    } catch {
      // ignore
    }

    // Auto-disable effect after 3.8s
    setTimeout(() => {
      set({ konamiActive: false });
    }, 3800);

    return true;
  },

  setKonamiActive: (active: boolean) => set({ konamiActive: active }),

  openDevModal: () => {
    set({ isDevModalOpen: true });
    try {
      useSettingsStore.getState().addNotification({
        title: 'Developer Dossier Unlocked',
        message: 'Discovered hidden profile intelligence for Vansh Bhura.',
        source: 'Security',
        icon: 'Fingerprint',
      });
    } catch {
      // ignore
    }
  },

  closeDevModal: () => set({ isDevModalOpen: false }),

  toggleDevModeOverlay: () => {
    const next = !get().isDevModeOverlayOpen;
    set({ isDevModeOverlayOpen: next });
    if (next) {
      try {
        useSettingsStore.getState().addNotification({
          title: 'Developer Mode HUD',
          message: 'Project and architectural telemetries engaged. Press Esc or Alt+D to exit.',
          source: 'System',
          icon: 'Terminal',
        });
      } catch {
        // ignore
      }
    }
  },

  setDevModeOverlay: (open: boolean) => set({ isDevModeOverlayOpen: open }),

  triggerDesktopSecret: () => {
    const now = Date.now();
    if (now - lastDesktopSecretTime < DESKTOP_SECRET_COOLDOWN_MS) return;
    lastDesktopSecretTime = now;

    set({ desktopRippleActive: true });
    setTimeout(() => set({ desktopRippleActive: false }), 2000);

    try {
      useSettingsStore.getState().addNotification({
        title: 'Kernel Whisper',
        message: '“Ideas > Code > Impact. Built with curiosity and craft by Vansh Bhura.”',
        source: 'VNX.OS',
        icon: 'Sparkles',
      });
    } catch {
      // ignore
    }
  },
}));
