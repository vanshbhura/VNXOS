import { useState, useEffect } from 'react';

export interface BatteryState {
  /** 0–100, or null when API is unavailable */
  level: number | null;
  charging: boolean;
  /** true = Battery Status API is available in this browser */
  supported: boolean;
}

const UNSUPPORTED: BatteryState = { level: null, charging: false, supported: false };

// Extend Navigator with the non-standard Battery Status API
interface BatteryManager extends EventTarget {
  level: number;          // 0.0–1.0
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>(() => {
    // navigator.getBattery is a function only in supporting browsers
    if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
      return { level: null, charging: false, supported: true };
    }
    return UNSUPPORTED;
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || typeof navigator.getBattery !== 'function') {
      setState(UNSUPPORTED);
      return;
    }

    let battery: BatteryManager | null = null;

    const update = (b: BatteryManager) => {
      setState({
        level: Math.round(b.level * 100),
        charging: b.charging,
        supported: true,
      });
    };

    const onLevelChange = () => battery && update(battery);
    const onChargingChange = () => battery && update(battery);

    navigator.getBattery!().then((b) => {
      battery = b;
      update(b);

      b.addEventListener('levelchange', onLevelChange);
      b.addEventListener('chargingchange', onChargingChange);
    }).catch(() => {
      setState(UNSUPPORTED);
    });

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', onLevelChange);
        battery.removeEventListener('chargingchange', onChargingChange);
      }
    };
  }, []);

  return state;
}