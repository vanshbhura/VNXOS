import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Lock, Moon, Power, LogOut, ExternalLink } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useOSStore } from '../../store/osStore';
import { getApp } from '../../data/apps';
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL, openExternalLink } from '../../data/socialLinks';

export default function UserMenuPanel() {
  const { setPowerState, setActiveOverlay } = useSettingsStore();
  const openWindow = useOSStore((s) => s.openWindow);

  const close = () => setActiveOverlay('none');

  const openApp = (id: string) => {
    close();
    const app = getApp(id);
    if (app) openWindow(app);
  };

  const handleExternal = (url: string) => {
    close();
    openExternalLink(url);
  };

  const handleLock = () => { close(); setPowerState('locked'); };
  const handleSleep = () => { close(); setPowerState('sleeping'); };
  const handleShutdown = () => { close(); setPowerState('shutdown'); };
  const handleLogOut = () => { close(); setPowerState('locked'); };

  const menuItem = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    color?: string,
    danger?: boolean
  ) => (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
        background: 'none', textAlign: 'left',
        color: danger ? '#f87171' : (color ?? 'rgba(226,232,240,0.8)'),
        fontSize: 12,
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
    >
      <span style={{ opacity: 0.8 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      style={{
        position: 'fixed', top: 34, right: 8, width: 220, zIndex: 9500,
        background: 'rgba(10,10,22,0.93)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        padding: '8px 6px',
      }}
    >
      {/* Profile header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 4,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16, fontWeight: 700,
        }}>
          V
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>Vansh Bhura</div>
          <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)' }}>Full-Stack Developer</div>
        </div>
      </div>

      {/* Actions */}
      {menuItem(<User size={13} />, 'About Me', () => openApp('about'))}
      {menuItem(<Settings size={13} />, 'Settings', () => openApp('settings'))}

      <div style={{ margin: '4px 6px', height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {menuItem(<ExternalLink size={13} />, 'GitHub Profile', () => handleExternal(GITHUB_PROFILE_URL))}
      {menuItem(<ExternalLink size={13} />, 'LinkedIn', () => handleExternal(LINKEDIN_PROFILE_URL))}

      <div style={{ margin: '4px 6px', height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {menuItem(<Lock size={13} />, 'Lock Screen', handleLock, 'rgba(148,163,184,0.9)')}
      {menuItem(<Moon size={13} />, 'Sleep', handleSleep, 'rgba(148,163,184,0.9)')}
      {menuItem(<LogOut size={13} />, 'Log Out', handleLogOut, undefined, false)}
      {menuItem(<Power size={13} />, 'Shut Down', handleShutdown, undefined, true)}
    </motion.div>
  );
}
