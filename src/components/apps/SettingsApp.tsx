import React, { useState } from 'react';
import {
  Palette, Image, PanelsTopLeft, Monitor, AppWindow, Volume2,
  Wifi, BatteryCharging, Power, ChevronRight, Lock, Moon,
  RefreshCw, LogOut, Sun, Check,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { wallpapers } from '../../data/wallpapers';

type Category =
  | 'appearance' | 'wallpaper' | 'dock' | 'desktop-icons'
  | 'windows' | 'sound-display' | 'network' | 'power';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
  { id: 'wallpaper', label: 'Wallpaper', icon: <Image size={14} /> },
  { id: 'dock', label: 'Dock', icon: <PanelsTopLeft size={14} /> },
  { id: 'desktop-icons', label: 'Desktop Icons', icon: <Monitor size={14} /> },
  { id: 'windows', label: 'Windows', icon: <AppWindow size={14} /> },
  { id: 'sound-display', label: 'Sound & Display', icon: <Volume2 size={14} /> },
  { id: 'network', label: 'Network & Battery', icon: <Wifi size={14} /> },
  { id: 'power', label: 'System & Power', icon: <Power size={14} /> },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)', marginBottom: 10, marginTop: 20 }}>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
        background: checked ? '#7c3aed' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
      gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 12.5, color: 'rgba(226,232,240,0.85)', fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 10.5, color: 'rgba(100,116,139,0.7)', marginTop: 2 }}>{description}</div>}
      </div>
      {children}
    </div>
  );
}

function Slider({ min, max, value, onChange, color = '#7c3aed' }: {
  min: number; max: number; value: number; onChange: (v: number) => void; color?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: color, height: 4 }}
      />
      <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.7)', minWidth: 30, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function Select<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      style={{
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6, padding: '4px 8px', color: '#e2e8f0', fontSize: 11.5, cursor: 'pointer',
        outline: 'none',
      }}
    >
      {options.map((o) => <option key={o.value} value={o.value} style={{ background: '#0f0f1e' }}>{o.label}</option>)}
    </select>
  );
}

function PowerButton({ label, icon, onClick, danger }: {
  label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '14px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
        color: danger ? '#f87171' : 'rgba(148,163,184,0.8)',
        fontSize: 11, fontWeight: 500, minWidth: 80,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.09)'}
      onMouseLeave={(e) => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)'}
    >
      {icon}
      {label}
    </button>
  );
}

export default function SettingsApp() {
  const [activeCategory, setActiveCategory] = useState<Category>('appearance');
  const settings = useSettingsStore();

  const contentStyle: React.CSSProperties = {
    flex: 1, overflowY: 'auto', padding: '20px 24px',
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'appearance':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Appearance</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Control the overall look of VNX.OS.</p>

            <SectionTitle>Theme</SectionTitle>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['dark', 'light', 'high-contrast'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => settings.setTheme(t)}
                  style={{
                    flex: 1, padding: '14px 10px', borderRadius: 10, cursor: 'pointer',
                    background: settings.theme === t ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${settings.theme === t ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: settings.theme === t ? '#c4b5fd' : 'rgba(148,163,184,0.7)',
                    fontSize: 12, fontWeight: 500,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  }}
                >
                  <div style={{
                    width: 40, height: 28, borderRadius: 6,
                    background: t === 'dark' ? 'linear-gradient(135deg,#0a0520,#030308)'
                      : t === 'light' ? 'linear-gradient(135deg,#f0f9ff,#e0e7ff)'
                        : 'linear-gradient(135deg,#000,#111)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }} />
                  {t === 'dark' ? 'VNX Dark' : t === 'light' ? 'Daylight' : 'High Contrast'}
                  {settings.theme === t && <Check size={10} style={{ color: '#a78bfa' }} />}
                </button>
              ))}
            </div>
          </div>
        );

      case 'wallpaper':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Wallpaper</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Choose a background for your desktop.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => settings.setWallpaper(wp.id)}
                  style={{
                    borderRadius: 10, border: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden',
                    outline: settings.wallpaper === wp.id ? '2px solid #7c3aed' : '2px solid transparent',
                    transition: 'outline 0.15s',
                    position: 'relative',
                  }}
                >
                  <div style={{ height: 72, background: wp.previewGradient, borderRadius: 8 }} />
                  <div style={{
                    padding: '6px 8px',
                    background: 'rgba(255,255,255,0.04)',
                    textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: '#e2e8f0' }}>{wp.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)' }}>{wp.description}</div>
                  </div>
                  {settings.wallpaper === wp.id && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#7c3aed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={10} style={{ color: '#fff' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'dock':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Dock</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Customize the application dock.</p>
            <Row label="Show Dock" description="Display the dock on screen">
              <ToggleSwitch checked={settings.dockSettings.visible} onChange={(v) => settings.updateDockSettings({ visible: v })} />
            </Row>
            <Row label="Auto-Hide" description="Hide dock when not in use">
              <ToggleSwitch checked={settings.dockSettings.autoHide} onChange={(v) => settings.updateDockSettings({ autoHide: v })} />
            </Row>
            <Row label="Icon Size" description={`${settings.dockSettings.iconSize}px`}>
              <Slider min={32} max={64} value={settings.dockSettings.iconSize} onChange={(v) => settings.updateDockSettings({ iconSize: v })} />
            </Row>
            <Row label="Position">
              <Select
                value={settings.dockSettings.position}
                options={[{ value: 'bottom', label: 'Bottom' }, { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]}
                onChange={(v) => settings.updateDockSettings({ position: v })}
              />
            </Row>
          </div>
        );

      case 'desktop-icons':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Desktop Icons</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Control icons displayed on the desktop.</p>
            <Row label="Show Icons" description="Display icons on the desktop">
              <ToggleSwitch checked={settings.desktopIconSettings.visible} onChange={(v) => settings.updateDesktopIconSettings({ visible: v })} />
            </Row>
            <Row label="Icon Size">
              <Select
                value={settings.desktopIconSettings.size}
                options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]}
                onChange={(v) => settings.updateDesktopIconSettings({ size: v })}
              />
            </Row>
            <Row label="Grid Snap" description="Snap icons to an invisible grid">
              <ToggleSwitch checked={settings.desktopIconSettings.gridSnap} onChange={(v) => settings.updateDesktopIconSettings({ gridSnap: v })} />
            </Row>
          </div>
        );

      case 'windows':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Windows</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Configure window behavior.</p>
            <Row label="Animations" description="Enable window open/close animations">
              <ToggleSwitch checked={settings.windowSettings.animations} onChange={(v) => settings.updateWindowSettings({ animations: v })} />
            </Row>
            <Row label="Window Snapping" description="Snap windows to screen edges">
              <ToggleSwitch checked={settings.windowSettings.snap} onChange={(v) => settings.updateWindowSettings({ snap: v })} />
            </Row>
            <Row label="Remember Positions" description="Restore window positions on reopen">
              <ToggleSwitch checked={settings.windowSettings.rememberPositions} onChange={(v) => settings.updateWindowSettings({ rememberPositions: v })} />
            </Row>
          </div>
        );

      case 'sound-display':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Sound & Display</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Simulated hardware controls.</p>
            <SectionTitle>Sound</SectionTitle>
            <Row label="Volume" description={settings.simulatedVolume.muted ? 'Muted' : `${settings.simulatedVolume.level}%`}>
              <Slider min={0} max={100} value={settings.simulatedVolume.level} onChange={(v) => settings.setVolume({ level: v })} />
            </Row>
            <Row label="Mute">
              <ToggleSwitch checked={settings.simulatedVolume.muted} onChange={(v) => settings.setVolume({ muted: v })} />
            </Row>
            <SectionTitle>Display</SectionTitle>
            <Row label="Brightness" description={`${settings.simulatedBrightness}%`}>
              <Slider min={10} max={100} value={settings.simulatedBrightness} onChange={settings.setBrightness} color="#fbbf24" />
            </Row>
          </div>
        );

      case 'network':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Network & Battery</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Simulated network and power settings.</p>
            <SectionTitle>Wi-Fi</SectionTitle>
            <Row label="Wi-Fi" description={settings.simulatedWifi.connected ? `Connected to ${settings.simulatedWifi.networkName}` : 'Disconnected'}>
              <ToggleSwitch checked={settings.simulatedWifi.connected} onChange={(v) => settings.setWifi({ connected: v })} />
            </Row>
            {settings.simulatedWifi.connected && (
              <Row label="Network Name">
                <input
                  value={settings.simulatedWifi.networkName}
                  onChange={(e) => settings.setWifi({ networkName: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6, padding: '4px 10px', color: '#e2e8f0', fontSize: 11.5, outline: 'none',
                    width: 160,
                  }}
                />
              </Row>
            )}
            <SectionTitle>Battery</SectionTitle>
            <Row label="Battery Level" description={`${settings.simulatedBattery.level}%`}>
              <Slider min={0} max={100} value={settings.simulatedBattery.level} onChange={(v) => settings.setBattery({ level: v })} color="#4ade80" />
            </Row>
            <Row label="Charging">
              <ToggleSwitch checked={settings.simulatedBattery.charging} onChange={(v) => settings.setBattery({ charging: v })} />
            </Row>
          </div>
        );

      case 'power':
        return (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>System & Power</h2>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20 }}>Power and session management.</p>
            <SectionTitle>Session</SectionTitle>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <PowerButton label="Lock Screen" icon={<Lock size={18} />} onClick={() => settings.setPowerState('locked')} />
              <PowerButton label="Sleep" icon={<Moon size={18} />} onClick={() => settings.setPowerState('sleeping')} />
              <PowerButton label="Log Out" icon={<LogOut size={18} />} onClick={() => settings.setPowerState('locked')} />
            </div>
            <SectionTitle>Power</SectionTitle>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <PowerButton label="Restart" icon={<RefreshCw size={18} />} onClick={() => { settings.setPowerState('shutdown'); setTimeout(() => window.location.reload(), 800); }} />
              <PowerButton label="Shut Down" icon={<Power size={18} />} onClick={() => settings.setPowerState('shutdown')} danger />
            </div>
            <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.8)', fontWeight: 600, marginBottom: 4 }}>VNX.OS Simulation Notice</div>
              <div style={{ fontSize: 10.5, color: 'rgba(148,163,184,0.5)', lineHeight: 1.5 }}>
                All power actions are simulated within the browser. No real shutdown, restart, or sleep is performed on your system.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: 'rgba(8,8,18,0.5)',
      color: '#e2e8f0',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Sidebar */}
      <div style={{
        width: 180, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 8px', overflowY: 'auto',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.6)', padding: '4px 8px 10px' }}>
          Settings
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 9,
              padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: activeCategory === cat.id ? 'rgba(139,92,246,0.2)' : 'none',
              color: activeCategory === cat.id ? '#c4b5fd' : 'rgba(148,163,184,0.7)',
              fontSize: 12, fontWeight: activeCategory === cat.id ? 600 : 400,
              textAlign: 'left', transition: 'background 0.12s, color 0.12s',
              marginBottom: 2,
            }}
          >
            <span style={{ opacity: 0.8, flexShrink: 0 }}>{cat.icon}</span>
            {cat.label}
            {activeCategory === cat.id && <ChevronRight size={10} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {renderContent()}
      </div>
    </div>
  );
}
