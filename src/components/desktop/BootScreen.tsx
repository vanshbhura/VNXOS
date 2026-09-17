import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_KEY = 'vnx_boot_seen';

const bootLines = [
  { text: 'VNX.OS v1.0.0', color: '#a78bfa', bold: true },
  { text: 'Copyright © 2024 Vansh Bhura. All rights reserved.', color: '#64748b', bold: false },
  { text: '', color: '', bold: false },
  { text: 'Initializing kernel modules...', color: '#86efac', bold: false },
  { text: 'Loading environment...', color: '#86efac', bold: false },
  { text: 'Mounting filesystems...', color: '#86efac', bold: false },
  { text: 'Starting desktop environment...', color: '#86efac', bold: false },
  { text: 'Applying user preferences...', color: '#86efac', bold: false },
  { text: '', color: '', bold: false },
  { text: 'Welcome, Vansh.', color: '#67e8f9', bold: true },
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  const skip = useCallback(() => {
    if (!done) {
      setDone(true);
      localStorage.setItem(BOOT_KEY, '1');
      onComplete();
    }
  }, [done, onComplete]);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(BOOT_KEY);
    if (alreadySeen) {
      onComplete();
      return;
    }

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setVisibleLines(idx);
      if (idx >= bootLines.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          localStorage.setItem(BOOT_KEY, '1');
          onComplete();
        }, 600);
      }
    }, 130);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent | MouseEvent) => skip();
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [skip]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-start justify-center"
      style={{ background: '#070710', fontFamily: "'Ubuntu Mono', 'Courier New', monospace" }}
      onClick={skip}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="px-16 py-12 max-w-2xl w-full">
        {/* VNX.OS logo mark */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            }}
          >
            V
          </div>
          <span style={{ color: '#a78bfa', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px' }}>
            VNX.OS
          </span>
        </div>

        {/* Boot lines */}
        <div className="space-y-[3px]">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                fontSize: '13px',
                lineHeight: '1.6',
                color: line.color || '#334155',
                fontWeight: line.bold ? 700 : 400,
                minHeight: '20px',
              }}
            >
              {line.text && (
                <>
                  {!line.bold && line.text && (
                    <span style={{ color: '#22c55e', marginRight: '8px' }}>[ OK ]</span>
                  )}
                  {line.text}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Cursor blink */}
        {visibleLines > 0 && visibleLines < bootLines.length && (
          <motion.span
            style={{ display: 'inline-block', width: '8px', height: '15px', background: '#a78bfa', marginTop: '4px', verticalAlign: 'bottom' }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        )}

        <div
          style={{ marginTop: '40px', fontSize: '11px', color: '#1e293b' }}
        >
          Press any key or click to skip...
        </div>
      </div>
    </motion.div>
  );
}

export { BOOT_KEY };
