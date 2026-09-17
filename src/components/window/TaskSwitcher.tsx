import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useOSStore } from '../../store/osStore';

function LucideIcon({ name, size = 32 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} />;
  return <Icon size={size} />;
}

export default function TaskSwitcher() {
  const windows = useOSStore(s => s.windows);
  const focusWindow = useOSStore(s => s.focusWindow);
  const restoreWindow = useOSStore(s => s.restoreWindow);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // We only show task switcher if we have windows
  const activeWindows = [...windows].sort((a, b) => b.zIndex - a.zIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.altKey) {
        e.preventDefault(); // Prevent browser default tab switching if possible
        if (!isOpen && activeWindows.length > 0) {
          setIsOpen(true);
          // Default to the second window (the one we want to switch to) or first if only 1
          setSelectedIndex(activeWindows.length > 1 ? 1 : 0);
        } else if (isOpen) {
          setSelectedIndex(prev => {
            if (e.shiftKey) {
              return prev === 0 ? activeWindows.length - 1 : prev - 1;
            } else {
              return (prev + 1) % activeWindows.length;
            }
          });
        }
      }
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Alt') {
        setIsOpen(false);
        const target = activeWindows[selectedIndex];
        if (target) {
          if (target.state === 'minimized') restoreWindow(target.id);
          focusWindow(target.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, activeWindows, selectedIndex, focusWindow, restoreWindow]);

  if (activeWindows.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            background: 'rgba(15, 15, 25, 0.85)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {activeWindows.map((win, idx) => (
              <div
                key={win.id}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  background: selectedIndex === idx ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: selectedIndex === idx ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedIndex === idx ? '#fff' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.15s ease',
                }}
              >
                <LucideIcon name={win.icon} size={36} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#e2e8f0' }}>
            {activeWindows[selectedIndex]?.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
