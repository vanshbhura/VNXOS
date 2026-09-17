import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useOSStore } from '../../store/osStore';

function LucideIcon({ name, size = 13 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = Icons[name];
  if (!Icon) return null;
  return <Icon size={size} />;
}

export default function ContextMenu() {
  const cmVisible = useOSStore((s) => s.cmVisible);
  const cmX = useOSStore((s) => s.cmX);
  const cmY = useOSStore((s) => s.cmY);
  const cmItems = useOSStore((s) => s.cmItems);
  const hideContextMenu = useOSStore((s) => s.hideContextMenu);

  const menuRef = useRef<HTMLDivElement>(null);

  // Clamp so menu stays on screen
  const x = typeof window !== 'undefined' ? Math.min(cmX, window.innerWidth - 220) : cmX;
  const y = typeof window !== 'undefined' ? Math.min(cmY, window.innerHeight - 300) : cmY;

  return (
    <AnimatePresence>
      {cmVisible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.92, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: y,
            left: x,
            zIndex: 9000,
            minWidth: '200px',
            background: 'rgba(10, 10, 22, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '9px',
            padding: '4px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {cmItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              {item.separator && idx > 0 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '3px 10px' }} />
              )}
              <button
                className="context-menu-item w-full text-left"
                disabled={item.disabled}
                onClick={() => {
                  item.action();
                  hideContextMenu();
                }}
                style={{ opacity: item.disabled ? 0.4 : 1, width: '100%' }}
              >
                {item.icon && (
                  <span style={{ color: 'rgba(148,163,184,0.6)' }}>
                    <LucideIcon name={item.icon} size={13} />
                  </span>
                )}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
