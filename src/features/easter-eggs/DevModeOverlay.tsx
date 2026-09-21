import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Award, Terminal, Code, Cpu, Activity, CheckCircle2 } from 'lucide-react';
import { useEasterEggStore } from './easterEggStore';
import { projectsData } from '../../data/projects';
import { certificatesData } from '../../data/certificates';
import { skillsData } from '../../data/skills';

type TabKey = 'projects' | 'certifications' | 'stack' | 'experiments';

export default function DevModeOverlay() {
  const isOpen = useEasterEggStore((s) => s.isDevModeOverlayOpen);
  const setOpen = useEasterEggStore((s) => s.setDevModeOverlay);
  const [activeTab, setActiveTab] = useState<TabKey>('projects');

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(3, 4, 10, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '94%',
              maxWidth: 860,
              height: '80vh',
              maxHeight: 680,
              background: 'rgba(10, 11, 20, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 16,
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace, sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#38bdf8',
                    boxShadow: '0 0 10px #38bdf8',
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.08em' }}>
                    VNX.OS // DEVELOPER MODE HUD
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748b' }}>
                    REALTIME TELEMETRY &amp; ARCHITECTURAL DISCOVERY
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 10.5, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: 4 }}>
                  ALT+D TO TOGGLE
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(148, 163, 184, 0.7)',
                    cursor: 'pointer',
                    padding: 4,
                    borderRadius: 6,
                    display: 'flex',
                  }}
                  aria-label="Close Developer Mode"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: '8px 16px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {[
                { key: 'projects', label: 'PROJECTS', icon: Layers, count: projectsData.length },
                { key: 'certifications', label: 'HACKATHONS & CERTS', icon: Award, count: certificatesData.length },
                { key: 'stack', label: 'TECH STACK', icon: Code, count: skillsData.length },
                { key: 'experiments', label: 'SYSTEM ARCHITECTURE', icon: Cpu, count: 4 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as TabKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 14px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      color: isActive ? '#38bdf8' : '#94a3b8',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: 9.5,
                        background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        padding: '1px 5px',
                        borderRadius: 10,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                  {projectsData.map((project) => (
                    <div
                      key={project.id}
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{project.name}</span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: project.status === 'Completed' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(167, 139, 250, 0.15)',
                            color: project.status === 'Completed' ? '#4ade80' : '#c4b5fd',
                          }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                        {project.shortDescription}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto', paddingTop: 6 }}>
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 9.5,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#cbd5e1',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CERTIFICATIONS & HACKATHONS */}
              {activeTab === 'certifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {certificatesData.map((cert) => (
                    <div
                      key={cert.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 16,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>{cert.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{cert.issuer}</div>
                        <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 4 }}>{cert.description}</div>
                      </div>
                      <span style={{ fontSize: 10.5, color: '#a78bfa', flexShrink: 0, fontWeight: 600 }}>
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* TECH STACK */}
              {activeTab === 'stack' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                  {skillsData.map((cat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', marginBottom: 10 }}>
                        {cat.category.toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {cat.skills.map((skill, si) => (
                          <span
                            key={si}
                            style={{
                              fontSize: 11,
                              padding: '4px 10px',
                              borderRadius: 6,
                              background: 'rgba(56, 189, 248, 0.08)',
                              border: '1px solid rgba(56, 189, 248, 0.15)',
                              color: '#e2e8f0',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EXPERIMENTS & ARCHITECTURE */}
              {activeTab === 'experiments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>
                      1. Client-Side Virtual File System (VFS)
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                      Hierarchical in-memory tree nodes synchronized with localStorage persistence. Fully supports directories, files, MIME types, dynamic paths, and child traversal without server reliance.
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>
                      2. Simulated Multi-Shell Execution Engine
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                      Pluggable shell registry supporting Bash, Windows Command Prompt, and PowerShell with tokenizer, tab autocomplete, per-instance working directory state, and command history buffers.
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#c4b5fd', marginBottom: 4 }}>
                      3. Floating Window Physics &amp; Snap Engine
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                      Multi-window orchestration with smart offsets, persistent geometry memory, z-index elevation, edge snapping, full maximization, and taskbar integration.
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f43f5e', marginBottom: 4 }}>
                      4. Agentic AI &amp; Interactive Web Systems Exploration
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
                      Current research and prototyping around autonomous agentic workflows, contextual retrieval-augmented generation (RAG), and client-side operating environments.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 10.5,
                color: '#64748b',
              }}
            >
              <span>STATUS: ONLINE // ENVIRONMENT: VNX.OS CLIENT RUNTIME</span>
              <span>PRESS ESC TO RETURN TO DESKTOP</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
