import React from 'react';
import { useTime } from '../../hooks/useTime';
import { useOSStore } from '../../store/osStore';
import {
  Wifi,
  Volume2,
  Battery,
  ChevronDown,
  User,
} from 'lucide-react';

export default function TopBar() {
  const { timeStr, dateStr } = useTime();
  const toggleLauncher = useOSStore((s) => s.toggleLauncher);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: '28px',
        background: 'rgba(8, 8, 16, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left — Logo + Menus */}
      <div className="flex items-center gap-1">
        <button
          className="topbar-btn font-semibold tracking-widest"
          style={{ color: '#a78bfa', fontSize: '12px', letterSpacing: '0.15em' }}
          onClick={toggleLauncher}
        >
          VNX.OS
        </button>

        <div className="w-px h-3 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {['Applications', 'Places', 'System'].map((label) => (
          <button key={label} className="topbar-btn">
            {label}
            <ChevronDown size={10} className="opacity-50" />
          </button>
        ))}
      </div>

      {/* Right — System tray */}
      <div className="flex items-center gap-1">
        <button className="topbar-btn">
          <Wifi size={12} className="opacity-70" />
        </button>
        <button className="topbar-btn">
          <Volume2 size={12} className="opacity-70" />
        </button>
        <button className="topbar-btn">
          <Battery size={12} className="opacity-70" />
          <span style={{ fontSize: '11px', opacity: 0.7 }}>98%</span>
        </button>

        <div className="w-px h-3 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <button className="topbar-btn flex-col items-end gap-0" style={{ padding: '0 8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.2 }}>{timeStr}</span>
          <span style={{ fontSize: '10px', opacity: 0.55, lineHeight: 1.2 }}>{dateStr}</span>
        </button>

        <div className="w-px h-3 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <button className="topbar-btn">
          <User size={12} className="opacity-70" />
          <span style={{ fontSize: '11px' }}>vansh</span>
        </button>
      </div>
    </div>
  );
}
