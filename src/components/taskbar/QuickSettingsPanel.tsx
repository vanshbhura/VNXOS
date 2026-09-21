import React from 'react';
import { motion } from 'framer-motion';
import {
  Wifi, WifiOff, Volume2, VolumeX, Sun, BatteryCharging, Battery,
  Settings, Moon, Zap,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useOSStore } from '../../store/osStore';
import { getApp } from '../../data/apps';

export default function QuickSettingsPanel() {
  const {
    simulatedWifi, simulatedVolume, simulatedBrightness, simulatedBattery,
    setWifi, setVolume, setBrightness, theme, setTheme, setActiveOverlay,
  } = useSettingsStore();
  const openWindow = useOSStore((s) => s.openWindow);

  const openSettings = () => {
    setActiveOverlay('none');
    const app = getApp('settings');
    if (app) openWindow(app);
  };

  const toggleWifi = () => setWifi({ connected: !simulatedWifi.connected });
  const toggleMute = () => setVolume({ muted: !simulatedVolume.muted });
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const batteryColor = simulatedBattery.level < 20 ? '#ef4444' : simulatedBattery.level < 40 ? '#f59e0b' : '#4ade80';

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11.5, color: 'rgba(148,163,184,0.8)', minWidth: 60,
  };
  const valueStyle: React.CSSProperties = {
    fontSize: 11.5, color: 'rgba(226,232,240,0.7)', marginLeft: 'auto',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      style={{
        position: 'fixed', top: 34, right: 8, width: 280, zIndex: 9500,
        background: 'rgba(10,10,22,0.92)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.1)',
        padding: '14px 16px',
      }}
    >
      {/* Toggle tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {/* WiFi tile */}
        <button
          onClick={toggleWifi}
          style={{
            padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: simulatedWifi.connected ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
            display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left',
          }}
        >
          <span style={{ color: simulatedWifi.connected ? '#a78bfa' : 'rgba(148,163,184,0.5)' }}>
            {simulatedWifi.connected ? <Wifi size={16} /> : <WifiOff size={16} />}
          </span>
          <span style={{ fontSize: 11, color: simulatedWifi.connected ? '#c4b5fd' : 'rgba(148,163,184,0.5)', fontWeight: 600 }}>
            Wi-Fi
          </span>
          <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>
            {simulatedWifi.connected ? simulatedWifi.networkName : 'Off'}
          </span>
        </button>

        {/* Theme tile */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: theme === 'dark' ? 'rgba(139,92,246,0.2)' : 'rgba(251,191,36,0.15)',
            display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left',
          }}
        >
          <span style={{ color: theme === 'dark' ? '#a78bfa' : '#fbbf24' }}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </span>
          <span style={{ fontSize: 11, color: theme === 'dark' ? '#c4b5fd' : '#fbbf24', fontWeight: 600 }}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)' }}>
            Click to toggle
          </span>
        </button>
      </div>

      {/* Volume */}
      <div style={rowStyle}>
        <button onClick={toggleMute} style={{ color: simulatedVolume.muted ? 'rgba(148,163,184,0.4)' : '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {simulatedVolume.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <span style={labelStyle}>Volume</span>
        <input
          type="range" min={0} max={100} value={simulatedVolume.muted ? 0 : simulatedVolume.level}
          onChange={(e) => setVolume({ level: Number(e.target.value), muted: false })}
          style={{ flex: 1, accentColor: '#a78bfa', height: 4 }}
        />
        <span style={valueStyle}>{simulatedVolume.muted ? 'Muted' : `${simulatedVolume.level}%`}</span>
      </div>

      {/* Brightness */}
      <div style={rowStyle}>
        <span style={{ color: '#fbbf24' }}><Sun size={14} /></span>
        <span style={labelStyle}>Brightness</span>
        <input
          type="range" min={10} max={100} value={simulatedBrightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#fbbf24', height: 4 }}
        />
        <span style={valueStyle}>{simulatedBrightness}%</span>
      </div>

      {/* Battery */}
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span style={{ color: batteryColor }}>
          {simulatedBattery.charging ? <BatteryCharging size={14} /> : <Battery size={14} />}
        </span>
        <span style={labelStyle}>Battery</span>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div style={{ width: `${simulatedBattery.level}%`, height: '100%', background: batteryColor, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <span style={{ ...valueStyle, color: batteryColor }}>
          {simulatedBattery.level}%{simulatedBattery.charging ? ' ⚡' : ''}
        </span>
      </div>

      {/* Settings shortcut */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={openSettings}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'rgba(226,232,240,0.7)', fontSize: 12,
            transition: 'background 0.15s',
          }}
        >
          <Zap size={13} style={{ color: '#a78bfa' }} />
          Open System Settings
          <Settings size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
        </button>
      </div>
    </motion.div>
  );
}
