import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTime } from '../../hooks/useTime';
import { useBattery } from '../../hooks/useBattery';
import { useOSStore } from '../../store/osStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getApp } from '../../data/apps';
import {
  Wifi, WifiOff, Volume2, VolumeX, BatteryCharging, Battery, BatteryLow,
  ChevronDown, Bell, User,
} from 'lucide-react';
import QuickSettingsPanel from './QuickSettingsPanel';
import NotificationCenterPanel from './NotificationCenterPanel';
import CalendarPanel from './CalendarPanel';
import UserMenuPanel from './UserMenuPanel';
import { useEasterEggStore } from '../../features/easter-eggs/easterEggStore';


// Applications menu items
const APP_MENU_ITEMS = [
  { label: 'Projects', appId: 'projects' },
  { label: 'Games Hub', appId: 'games' },
  { label: 'Snake', appId: 'snake' },
  { label: 'Impossible Tic Tac Toe', appId: 'tictactoe' },
  { label: 'Flappy Bird', appId: 'flappy' },
  { label: 'About Me', appId: 'about' },
  { label: 'File Manager', appId: 'file-manager' },
  { label: 'Terminal', appId: 'terminal' },
  { label: 'Notes', appId: 'notes' },
  { label: 'Settings', appId: 'settings' },
];

const PLACES_MENU_ITEMS = [
  { label: 'Home Folder', appId: 'file-manager', path: '/home/vansh' },
  { label: 'Desktop', appId: 'file-manager', path: '/home/vansh/Desktop' },
  { label: 'Games', appId: 'file-manager', path: '/home/vansh/Games' },
  { label: 'Documents', appId: 'file-manager', path: '/home/vansh/Documents' },
  { label: 'Projects', appId: 'file-manager', path: '/home/vansh/Projects' },
];

const SYSTEM_MENU_ITEMS = [
  { label: 'Settings', appId: 'settings' },
  { label: 'About VNX.OS', appId: 'about' },
];

function TopMenuButton({
  label,
  items,
}: {
  label: string;
  items: { label: string; appId: string; path?: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const openWindow = useOSStore((s) => s.openWindow);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleItem = (appId: string, path?: string) => {
    setOpen(false);
    const app = getApp(appId);
    if (app) openWindow(app, undefined, path);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="topbar-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={10} className="opacity-50" />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 0,
            minWidth: 180,
            background: 'rgba(10,10,22,0.96)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9,
            padding: 4,
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            zIndex: 9500,
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              className="context-menu-item"
              onClick={() => handleItem(item.appId, item.path)}
              style={{ width: '100%' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar() {
  const { timeStr, dateStr } = useTime();
  const battery = useBattery();
  const toggleLauncher = useOSStore((s) => s.toggleLauncher);
  const logoClicksRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - logoClicksRef.current.lastTime > 2500) {
      logoClicksRef.current.count = 1;
    } else {
      logoClicksRef.current.count += 1;
    }
    logoClicksRef.current.lastTime = now;

    if (logoClicksRef.current.count >= 5) {
      logoClicksRef.current.count = 0;
      useEasterEggStore.getState().openDevModal();
      return;
    }

    toggleLauncher();
  };

  const {
    simulatedWifi, simulatedVolume,
    activeOverlay, toggleOverlay, setActiveOverlay,
    notifications,
  } = useSettingsStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click-outside handler
  const topbarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topbarRef.current && !topbarRef.current.contains(e.target as Node)) {
        if (activeOverlay !== 'none' && activeOverlay !== 'global-search') {
          setActiveOverlay('none');
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeOverlay, setActiveOverlay]);

  // Battery display helpers
  const batteryLevel = battery.level;   // null | 0–100
  const batteryCharging = battery.charging;
  const batteryColor =
    batteryLevel === null ? '#94a3b8'
    : batteryLevel < 15  ? '#ef4444'
    : batteryLevel < 30  ? '#f97316'
    : '#94a3b8';

  function BatteryIcon() {
    if (batteryCharging) return <BatteryCharging size={12} style={{ color: '#4ade80', opacity: 0.85 }} />;
    if (batteryLevel !== null && batteryLevel < 15) return <BatteryLow size={12} style={{ color: batteryColor, opacity: 0.85 }} />;
    return <Battery size={12} style={{ color: batteryColor, opacity: 0.75 }} />;
  }

  return (
    <div ref={topbarRef}>
      <div
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-4"
        style={{
          zIndex: 9000,
          height: '28px',
          background: 'var(--os-topbar-bg, rgba(8, 8, 16, 0.75))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--os-border, rgba(255,255,255,0.05))',
          color: 'var(--os-text-primary)',
        }}
        role="navigation"
        aria-label="System top bar"
      >
        {/* Left — Logo + Menus */}
        <div className="flex items-center gap-1">
          <button
            className="topbar-btn font-semibold tracking-widest"
            style={{ color: '#a78bfa', fontSize: '12px', letterSpacing: '0.15em' }}
            onClick={handleLogoClick}
            aria-label="Open application launcher"
          >
            VNX.OS
          </button>

          <div className="w-px h-3 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          <TopMenuButton label="Applications" items={APP_MENU_ITEMS} />
          <TopMenuButton label="Places" items={PLACES_MENU_ITEMS} />
          <TopMenuButton label="System" items={SYSTEM_MENU_ITEMS} />
        </div>

        {/* Right — System tray */}
        <div className="flex items-center gap-1">
          {/* Notification bell */}
          <button
            className="topbar-btn"
            onClick={() => toggleOverlay('notifications')}
            style={{ position: 'relative' }}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={12} className="opacity-70" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 1, right: 1,
                width: 6, height: 6, borderRadius: '50%',
                background: '#7c3aed',
                border: '1px solid rgba(8,8,16,0.8)',
              }} />
            )}
          </button>

          {/* System tray — opens Quick Settings */}
          <button
            className="topbar-btn"
            onClick={() => toggleOverlay('quick-settings')}
            title="Quick Settings — Wi-Fi"
            aria-label={`Wi-Fi: ${simulatedWifi.connected ? 'Connected' : 'Disconnected'}`}
          >
            {simulatedWifi.connected ? <Wifi size={12} className="opacity-70" /> : <WifiOff size={12} className="opacity-50" />}
          </button>
          <button
            className="topbar-btn"
            onClick={() => toggleOverlay('quick-settings')}
            title="Quick Settings — Volume"
            aria-label={`Volume: ${simulatedVolume.muted ? 'Muted' : simulatedVolume.level + '%'}`}
          >
            {simulatedVolume.muted ? <VolumeX size={12} style={{ opacity: 0.4 }} /> : <Volume2 size={12} className="opacity-70" />}
          </button>
          <button
            className="topbar-btn"
            onClick={() => toggleOverlay('quick-settings')}
            title={battery.supported
              ? `Battery: ${batteryLevel ?? '…'}%${batteryCharging ? ' (charging)' : ''}`
              : 'AC Power (Desktop Mode)'}
            aria-label={battery.supported
              ? `Battery: ${batteryLevel ?? '…'}%${batteryCharging ? ' (charging)' : ''}`
              : 'AC Power (Desktop Mode)'}
          >
            <BatteryIcon />
            {battery.supported ? (
              <span style={{ fontSize: '11px', opacity: 0.75, fontVariantNumeric: 'tabular-nums' }}>
                {batteryLevel !== null ? `${batteryLevel}%` : '…'}
              </span>
            ) : null}
          </button>

          <div className="w-px h-3 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Clock — opens Calendar */}
          <button
            className="topbar-btn flex items-center gap-1.5"
            style={{ padding: '0 8px' }}
            onClick={() => toggleOverlay('calendar')}
            aria-label={`Open calendar, current date ${dateStr} ${timeStr}`}
          >
            <span style={{ fontSize: '11px', opacity: 0.65, fontWeight: 400 }}>{dateStr}</span>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>{timeStr}</span>
          </button>

          <div className="w-px h-3 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* User — opens User Menu */}
          <button
            className="topbar-btn"
            onClick={() => toggleOverlay('user-menu')}
            aria-label="User menu"
          >
            <User size={12} className="opacity-70" />
            <span style={{ fontSize: '11px' }}>vansh</span>
          </button>
        </div>
      </div>

      {/* Panels */}
      <AnimatePresence>
        {activeOverlay === 'quick-settings' && <QuickSettingsPanel key="qs" />}
        {activeOverlay === 'notifications' && <NotificationCenterPanel key="nc" />}
        {activeOverlay === 'calendar' && <CalendarPanel key="cal" />}
        {activeOverlay === 'user-menu' && <UserMenuPanel key="um" />}
      </AnimatePresence>
    </div>
  );
}
