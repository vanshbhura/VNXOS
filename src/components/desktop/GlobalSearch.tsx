import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Folder, FileText, Code, Terminal, User, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useOSStore } from '../../store/osStore';
import { useFileSystemStore } from '../../store/fsStore';
import { appRegistry, getApp } from '../../data/apps';
import { projectsData } from '../../data/projects';

function LucideIcon({ name, size = 14 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = Icons[name];
  if (!Icon) return <Search size={size} />;
  return <Icon size={size} />;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'App' | 'File' | 'Project' | 'Command';
  icon: string;
  iconColor: string;
  action: () => void;
}

export default function GlobalSearch() {
  const activeOverlay = useSettingsStore((s) => s.activeOverlay);
  const setActiveOverlay = useSettingsStore((s) => s.setActiveOverlay);
  const isOpen = activeOverlay === 'global-search';

  const openWindow = useOSStore((s) => s.openWindow);
  const nodes = useFileSystemStore((s) => s.nodes);

  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const close = () => setActiveOverlay('none');

  // Build search index
  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const res: SearchResult[] = [];

    // Apps
    for (const app of appRegistry) {
      if (app.name.toLowerCase().includes(q) || (app.description ?? '').toLowerCase().includes(q)) {
        res.push({
          id: `app-${app.id}`,
          title: app.name,
          subtitle: app.description ?? 'Application',
          category: 'App',
          icon: app.icon,
          iconColor: '#a78bfa',
          action: () => { close(); openWindow(app); },
        });
      }
    }

    // Files from VFS
    for (const node of Object.values(nodes)) {
      if (node.path === '/' || node.path === '/home' || node.path === '/home/vansh') continue;
      const name = node.name.toLowerCase();
      if (name.includes(q)) {
        res.push({
          id: `file-${node.id}`,
          title: node.name,
          subtitle: node.path,
          category: 'File',
          icon: node.type === 'folder' ? 'Folder' : 'FileText',
          iconColor: node.type === 'folder' ? '#60a5fa' : '#94a3b8',
          action: () => {
            close();
            const fm = getApp('file-manager');
            if (fm) openWindow(fm, undefined, node.type === 'folder' ? node.path : node.path.split('/').slice(0, -1).join('/'));
          },
        });
        if (res.length >= 30) break;
      }
    }

    // Projects
    for (const proj of projectsData) {
      const pq = proj.name.toLowerCase() + ' ' + (proj.shortDescription ?? '').toLowerCase() + ' ' + (proj.technologies ?? []).join(' ').toLowerCase();
      if (pq.includes(q)) {
        res.push({
          id: `proj-${proj.id}`,
          title: proj.name,
          subtitle: proj.shortDescription ?? 'Portfolio Project',
          category: 'Project',
          icon: 'Code',
          iconColor: '#f59e0b',
          action: () => { close(); const a = getApp('projects'); if (a) openWindow(a); },
        });
      }
    }

    return res.slice(0, 12);
  }, [query, nodes, openWindow]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    }
    return map;
  }, [results]);

  const flatResults = results;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, flatResults.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && flatResults[selectedIdx]) {
        flatResults[selectedIdx].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, flatResults, selectedIdx]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  const categoryIcon: Record<string, React.ReactNode> = {
    App: <User size={10} />,
    File: <Folder size={10} />,
    Project: <Code size={10} />,
    Command: <Terminal size={10} />,
  };

  const categoryColor: Record<string, string> = {
    App: '#a78bfa', File: '#60a5fa', Project: '#f59e0b', Command: '#4ade80',
  };

  if (!isOpen) return null;

  let flatIdx = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9700,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={close}
          />

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.97, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            style={{
              position: 'fixed', top: '15%', left: '50%',
              width: 560, maxWidth: 'calc(100vw - 32px)', zIndex: 9701,
              background: 'rgba(10,10,22,0.95)',
              backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 16,
              boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(139,92,246,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Input row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px',
              borderBottom: query && results.length > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <Search size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps, files, projects..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#e2e8f0', fontSize: 15,
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4,
                    color: 'rgba(148,163,184,0.7)', cursor: 'pointer',
                    padding: '2px 6px', fontSize: 10,
                  }}
                >
                  ESC
                </button>
              )}
            </div>

            {/* Results */}
            {query && (
              <div ref={listRef} style={{ maxHeight: 400, overflowY: 'auto', padding: '6px 0' }}>
                {results.length === 0 ? (
                  <div style={{ padding: '24px 18px', textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontSize: 13 }}>
                    No results for "{query}"
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      {/* Category label */}
                      <div style={{
                        padding: '6px 18px 3px',
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: categoryColor[category] ?? 'rgba(148,163,184,0.5)',
                      }}>
                        {categoryIcon[category]}
                        {category}
                      </div>

                      {items.map((result) => {
                        flatIdx++;
                        const thisIdx = flatIdx;
                        const isSelected = selectedIdx === thisIdx;
                        return (
                          <div
                            key={result.id}
                            onClick={result.action}
                            onMouseEnter={() => setSelectedIdx(thisIdx)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '8px 18px',
                              background: isSelected ? 'rgba(139,92,246,0.15)' : 'transparent',
                              cursor: 'pointer', transition: 'background 0.1s',
                              borderLeft: isSelected ? '2px solid #7c3aed' : '2px solid transparent',
                            }}
                          >
                            <div style={{
                              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                              background: isSelected ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: result.iconColor,
                            }}>
                              <LucideIcon name={result.icon} size={14} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, color: isSelected ? '#e2e8f0' : 'rgba(226,232,240,0.8)', fontWeight: 500 }}>
                                {result.title}
                              </div>
                              <div style={{ fontSize: 10.5, color: 'rgba(100,116,139,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {result.subtitle}
                              </div>
                            </div>
                            {isSelected && <ArrowRight size={12} style={{ color: '#7c3aed', flexShrink: 0 }} />}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Footer hint */}
            {!query && (
              <div style={{ padding: '12px 18px', display: 'flex', gap: 16, alignItems: 'center' }}>
                {[['↑↓', 'Navigate'], ['↵', 'Open'], ['Esc', 'Close']].map(([key, label]) => (
                  <span key={key} style={{ fontSize: 10.5, color: 'rgba(100,116,139,0.6)', display: 'flex', gap: 5, alignItems: 'center' }}>
                    <kbd style={{
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4, padding: '1px 5px', fontSize: 10, color: 'rgba(148,163,184,0.7)',
                    }}>{key}</kbd>
                    {label}
                  </span>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(100,116,139,0.4)' }}>
                  VNX.OS Search
                </span>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
