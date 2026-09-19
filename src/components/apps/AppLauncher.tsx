import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useSettingsStore } from '../../store/settingsStore';
import { appRegistry, getApp } from '../../data/apps';
import { Search, X, Star, StarOff, Clock } from 'lucide-react';

// ─── App category mapping ─────────────────────────────────────────────────────

const APP_CATEGORIES: Record<string, string> = {
  projects: 'Portfolio',
  about: 'Portfolio',
  experience: 'Portfolio',
  certificates: 'Portfolio',
  certifications: 'Portfolio',
  resume: 'Portfolio',
  github: 'Portfolio',
  linkedin: 'Portfolio',
  'file-manager': 'System',
  terminal: 'System',
  cmd: 'System',
  powershell: 'System',
  settings: 'System',
  trash: 'System',
  notes: 'Utilities',
  resources: 'Utilities',
  'ai-tools': 'Utilities',
};

const APP_ICON_COLORS: Record<string, string> = {
  projects: '#f59e0b',
  about: '#60a5fa',
  experience: '#8b5cf6',
  certificates: '#34d399',
  certifications: '#22d3ee',
  resume: '#f87171',
  notes: '#facc15',
  resources: '#ec4899',
  'ai-tools': '#818cf8',
  github: '#cbd5e1',
  linkedin: '#38bdf8',
  'file-manager': '#60a5fa',
  terminal: '#4ade80',
  cmd: '#cbd5e1',
  powershell: '#38bdf8',
  settings: '#94a3b8',
  trash: '#9ca3af',
};

const CATEGORY_ORDER = ['Portfolio', 'System', 'Utilities'];

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

  const favoriteAppIds = useSettingsStore((s) => s.favoriteAppIds);
  const toggleFavoriteApp = useSettingsStore((s) => s.toggleFavoriteApp);
  const recentItems = useSettingsStore((s) => s.recentItems);

  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [hoveredFav, setHoveredFav] = useState<string | null>(null);

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

  const handleLaunch = (appId: string) => {
    setOpen(false);
    const appDef = getApp(appId);
    if (appDef) openWindow(appDef);
  };

  // Build filtered + grouped app list
  const { favoriteApps, recentApps, grouped } = useMemo(() => {
    const q = query.toLowerCase().trim();

    // All registry apps (excluding trash from main display)
    const allApps = appRegistry.filter(a => a.id !== 'trash');

    const filtered = q
      ? allApps.filter(a =>
          a.name.toLowerCase().includes(q) ||
          (a.description ?? '').toLowerCase().includes(q) ||
          (APP_CATEGORIES[a.id] ?? '').toLowerCase().includes(q)
        )
      : allApps;

    // Favorites section
    const favApps = q
      ? []
      : allApps.filter(a => favoriteAppIds.includes(a.id));

    // Recent apps (last 5, unique, from recentItems)
    const recentAppItems = q ? [] : recentItems
      .filter(r => r.type === 'app' && r.appId)
      .filter((r, i, arr) => arr.findIndex(x => x.appId === r.appId) === i) // dedupe
      .slice(0, 5)
      .map(r => allApps.find(a => a.id === r.appId))
      .filter(Boolean) as typeof allApps;

    // Grouped by category for full list
    const grouped: Record<string, typeof allApps> = {};
    for (const app of filtered) {
      const cat = APP_CATEGORIES[app.id] ?? 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(app);
    }

    return { favoriteApps: favApps, recentApps: recentAppItems, grouped };
  }, [query, favoriteAppIds, recentItems]);

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => (CATEGORY_ORDER.indexOf(a) === -1 ? 99 : CATEGORY_ORDER.indexOf(a)) -
              (CATEGORY_ORDER.indexOf(b) === -1 ? 99 : CATEGORY_ORDER.indexOf(b))
  );

  const AppTile = ({ appId }: { appId: string }) => {
    const app = getApp(appId);
    if (!app) return null;
    const isFav = favoriteAppIds.includes(appId);
    const color = APP_ICON_COLORS[appId] ?? '#94a3b8';

    return (
      <div style={{ position: 'relative' }}>
        <motion.button
          className="launcher-item"
          onClick={() => handleLaunch(appId)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHoveredFav(appId)}
          onMouseLeave={() => setHoveredFav(null)}
          aria-label={`Open ${app.name}`}
          style={{ width: '100%' }}
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
              color,
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
            {app.name}
          </span>
        </motion.button>

        {/* Favorite toggle */}
        {hoveredFav === appId && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavoriteApp(appId); }}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              position: 'absolute',
              top: 2, right: 2,
              background: 'rgba(10,10,22,0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              padding: '2px 3px',
              cursor: 'pointer',
              color: isFav ? '#facc15' : 'rgba(148,163,184,0.6)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            {isFav ? <Star size={10} /> : <StarOff size={10} />}
          </button>
        )}
      </div>
    );
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
            width: '480px',
            maxHeight: 'calc(100vh - 80px)',
            zIndex: 60,
            background: 'rgba(10, 10, 22, 0.92)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          role="dialog"
          aria-label="Application Launcher"
        >
          {/* Search bar */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <Search size={15} style={{ color: 'rgba(148,163,184,0.7)', flexShrink: 0 }} />
            <input
              autoFocus
              type="text"
              placeholder="Search applications..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search applications"
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
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                style={{ color: 'rgba(148,163,184,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Scrollable content */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* Recent Apps */}
            {!query && recentApps.length > 0 && (
              <div style={{ padding: '10px 14px 4px' }}>
                <div style={{
                  fontSize: '10px', color: 'rgba(148,163,184,0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Clock size={9} /> Recent
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                  {recentApps.map(app => (
                    <AppTile key={`recent-${app.id}`} appId={app.id} />
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {!query && favoriteApps.length > 0 && (
              <div style={{ padding: '8px 14px 4px', borderTop: !query && recentApps.length > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{
                  fontSize: '10px', color: 'rgba(148,163,184,0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Star size={9} /> Favorites
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                  {favoriteApps.map(app => (
                    <AppTile key={`fav-${app.id}`} appId={app.id} />
                  ))}
                </div>
              </div>
            )}

            {/* All / Search Results by Category */}
            <div style={{ padding: '8px 14px 12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              {sortedCategories.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '24px 0',
                  color: 'rgba(148,163,184,0.4)', fontSize: '13px',
                }}>
                  No applications found
                </div>
              ) : (
                sortedCategories.map(cat => (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <div style={{
                      fontSize: '10px', color: 'rgba(148,163,184,0.5)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: '6px', paddingLeft: '2px',
                    }}>
                      {cat}
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '4px',
                    }}>
                      {grouped[cat].map((app) => (
                        <AppTile key={app.id} appId={app.id} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.5)' }}>
              {appRegistry.length - 1} apps installed
            </span>
            <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.4)' }}>
              Hover app → ⭐ to favorite
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
