import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEggStore } from './easterEggStore';

export default function KonamiDesktopEffect() {
  const konamiActive = useEasterEggStore((s) => s.konamiActive);

  return (
    <AnimatePresence>
      {konamiActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9998,
            overflow: 'hidden',
          }}
        >
          {/* Subtle perimeter neon pulse */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: 'inset 0 0 100px rgba(167, 139, 250, 0.35), inset 0 0 30px rgba(56, 189, 248, 0.3)',
              borderRadius: 0,
            }}
          />

          {/* Ethereal aurora ribbon sweep */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: ['-100%', '100%'], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40vh',
              background: 'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.12) 50%, rgba(56, 189, 248, 0.08) 80%, transparent 100%)',
              filter: 'blur(30px)',
            }}
          />

          {/* Minimalist retro watermark stamp in bottom corner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              position: 'absolute',
              bottom: 80,
              right: 24,
              padding: '6px 14px',
              background: 'rgba(15, 15, 30, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#c4b5fd',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
            <span>CHEAT CODE DETECTED // VNX KERNEL ENHANCED</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
