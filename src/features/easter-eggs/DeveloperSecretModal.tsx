import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Award, Terminal, Code2, GraduationCap, Cpu } from 'lucide-react';
import { useEasterEggStore } from './easterEggStore';
import { profileData } from '../../data/profile';
import { certificatesData } from '../../data/certificates';

export default function DeveloperSecretModal() {
  const isOpen = useEasterEggStore((s) => s.isDevModalOpen);
  const closeModal = useEasterEggStore((s) => s.closeDevModal);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  // Verified competition items
  const competitionHighlights = certificatesData
    .filter((c) =>
      c.name.includes('IDEathon') ||
      c.name.includes('Hackathon') ||
      c.name.includes('Code Crunch') ||
      c.name.includes('AMD')
    )
    .slice(0, 4);

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
            background: 'rgba(5, 5, 12, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '92%',
              maxWidth: 580,
              background: 'rgba(13, 15, 26, 0.95)',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              borderRadius: 16,
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8), 0 0 30px rgba(124, 58, 237, 0.15)',
              overflow: 'hidden',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: 'rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a78bfa',
                  }}
                >
                  <Shield size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
                    DEVELOPER DOSSIER // CLASSIFIED
                  </div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'monospace' }}>
                    SECURITY CLEARANCE: VERIFIED
                  </div>
                </div>
              </div>

              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(148, 163, 184, 0.7)',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(148, 163, 184, 0.7)';
                  (e.currentTarget as HTMLElement).style.background = 'none';
                }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 22px', maxHeight: '72vh', overflowY: 'auto' }}>
              {/* Profile Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(30, 64, 175, 0.35))',
                    border: '1px solid rgba(167, 139, 250, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c4b5fd',
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  VB
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{profileData.name}</div>
                  <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 500 }}>{profileData.role}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    NIMS University • B.Tech AIML (CGPA: 8.3)
                  </div>
                </div>
              </div>

              {/* Personality & Engineering Facts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Fact 1 */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    <Cpu size={14} /> Core Architectural Focus
                  </div>
                  <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
                    {profileData.currentFocus}
                  </div>
                </div>

                {/* Fact 2 - Hackathons & Competitions */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fbbf24', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    <Award size={14} /> Verified Competition Record
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {competitionHighlights.map((cert) => (
                      <div key={cert.id} style={{ fontSize: 11.5, color: '#94a3b8', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ color: '#a78bfa', fontWeight: 700 }}>•</span>
                        <div>
                          <strong style={{ color: '#e2e8f0' }}>{cert.name}</strong> —{' '}
                          <span>{cert.issuer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fact 3 - Systems Philosophy */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(124, 58, 237, 0.06)',
                    border: '1px solid rgba(167, 139, 250, 0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#c4b5fd', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    <Code2 size={14} /> The VNX.OS Philosophy
                  </div>
                  <div style={{ fontSize: 11.5, color: '#cbd5e1', lineHeight: 1.5 }}>
                    “Ideas &gt; Code &gt; Impact.” Built from scratch using modern React, TypeScript, and Framer Motion to provide a realistic operating system interface entirely client-side in the browser.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 11, color: 'rgba(148, 163, 184, 0.6)', fontFamily: 'monospace' }}>
                DISCOVERED VIA EASTER EGG PROTOCOL
              </span>
              <button
                onClick={closeModal}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: 'rgba(124, 58, 237, 0.8)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124, 58, 237, 1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124, 58, 237, 0.8)';
                }}
              >
                Close Dossier
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
