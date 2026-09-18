import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { getApp } from '../../data/apps';
import { Search, X } from 'lucide-react';

interface LauncherApp {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  appId?: string;
  href?: string;
}

const launcherApps: LauncherApp[] = [
  { id: 'projects', label: 'Projects', icon: 'FolderOpen', iconColor: '#f59e0b', appId: 'projects' },
  { id: 'about', label: 'About Me', icon: 'User', iconColor: '#60a5fa', appId: 'about' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase', iconColor: '#8b5cf6', appId: 'experience' },
  { id: 'certificates', label: 'Certificates', icon: 'Award', iconColor: '#34d399', appId: 'certificates' },
  { id: 'certifications', label: 'Certifications', icon: 'ShieldCheck', iconColor: '#22d3ee', appId: 'certifications' },
  { id: 'resume', label: 'Resume', icon: 'FileText', iconColor: '#f87171', appId: 'resume' },
  { id: 'notes', label: 'Notes', icon: 'StickyNote', iconColor: '#facc15', appId: 'notes' },
  { id: 'resources', label: 'Resources', icon: 'Library', iconColor: '#ec4899', appId: 'resources' },
  { id: 'ai-tools', label: 'AI Tools', icon: 'Bot', iconColor: '#818cf8', appId: 'ai-tools' },
  { id: 'github', label: 'GitHub', icon: 'Code', iconColor: '#cbd5e1', appId: 'github' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'User', iconColor: '#38bdf8', appId: 'linkedin' },
  { id: 'file-manager', label: 'Files', icon: 'Folder', iconColor: '#60a5fa', appId: 'file-manager' },
  { id: 'terminal', label: 'Terminal', icon: 'Terminal', iconColor: '#4ade80', appId: 'terminal' },
  { id: 'settings', label: 'Settings', icon: 'Settings', iconColor: '#94a3b8', appId: 'settings' },
];

function LucideIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} />;
  return <Icon size={size} />;
}

export default function AppLauncher() {
  const isOpen = useOSStore((s) => s.isLauncherOpen);
  const setOpen = useOSStore((s) => s.setLauncherOpen);
  const openWindow = useOSStore((s) => s.openWindow);
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, setOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setOpen]);

  const filtered = launcherApps.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleLaunch = (app: LauncherApp) => {
    setOpen(false);
    if (app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (app.appId) {
      const appDef = getApp(app.appId);
      if (appDef) {
        console.log(`Launcher: Opening ${appDef.name}`);
        openWindow(appDef);
      } else {
        console.log(`Launcher: App "${app.appId}" not yet implemented`);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.94, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            top: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '440px',
            zIndex: 60,
            background: 'rgba(10, 10, 22, 0.88)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Search bar */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Search size={15} style={{ color: 'rgba(148,163,184,0.7)', flexShrink: 0 }} />
            <input
              autoFocus
              type="text"
              placeholder="Search applications..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e2e8f0',
                fontSize: '13.5px',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'rgba(148,163,184,0.5)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* App grid */}
          <div style={{ padding: '12px 14px 14px' }}>
            <div
              style={{
                fontSize: '10.5px',
                color: 'rgba(148,163,184,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '10px',
                paddingLeft: '4px',
              }}
            >
              {query ? 'Results' : 'All Applications'}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
              }}
            >
              {filtered.map((app) => (
                <motion.button
                  key={app.id}
                  className="launcher-item"
                  onClick={() => handleLaunch(app)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: app.iconColor,
                    }}
                  >
                    <LucideIcon name={app.icon} size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(226,232,240,0.8)',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {app.label}
                  </span>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div
                  style={{
                    gridColumn: '1/-1',
                    textAlign: 'center',
                    padding: '24px 0',
                    color: 'rgba(148,163,184,0.4)',
                    fontSize: '13px',
                  }}
                >
                  No applications found
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
