import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSettingsStore, type VNXNotification } from '../../store/settingsStore';

function LucideIcon({ name, size = 15 }: { name?: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = name ? Icons[name] : null;
  if (!Icon) return <Bell size={size} />;
  return <Icon size={size} />;
}

export default function NotificationToast() {
  const notifications = useSettingsStore((s) => s.notifications);
  const markNotificationRead = useSettingsStore((s) => s.markNotificationRead);
  const dismissNotification = useSettingsStore((s) => s.dismissNotification);

  const [activeToast, setActiveToast] = useState<VNXNotification | null>(null);
  const lastKnownIdRef = useRef<string | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first mount, just record the most recent ID so we don't spam toasts from historical notifications
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (notifications.length > 0) {
        lastKnownIdRef.current = notifications[0].id;
      }
      return;
    }

    if (notifications.length === 0) return;

    const latest = notifications[0];

    // If there is a new unread notification that we haven't displayed as a toast yet
    if (latest.id !== lastKnownIdRef.current && !latest.read) {
      lastKnownIdRef.current = latest.id;
      setActiveToast(latest);

      // Clear previous timer
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }

      // Auto-dismiss after 4.5 seconds
      dismissTimerRef.current = window.setTimeout(() => {
        setActiveToast(null);
      }, 4500);
    }
  }, [notifications]);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeToast) {
      dismissNotification(activeToast.id);
      setActiveToast(null);
    }
  };

  const handleClick = () => {
    if (activeToast) {
      markNotificationRead(activeToast.id);
      setActiveToast(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 36,
        right: 16,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={handleClick}
            style={{
              pointerEvents: 'auto',
              width: 320,
              maxWidth: '90vw',
              background: 'rgba(13, 14, 25, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              borderRadius: 12,
              padding: '12px 14px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 20px rgba(124, 58, 237, 0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa',
                flexShrink: 0,
              }}
            >
              <LucideIcon name={activeToast.icon} size={16} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#f8fafc',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeToast.title}
                </span>
                <span style={{ fontSize: 9.5, color: '#64748b', flexShrink: 0 }}>
                  {activeToast.source}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(203, 213, 225, 0.85)',
                  marginTop: 3,
                  lineHeight: 1.4,
                }}
              >
                {activeToast.message}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(148, 163, 184, 0.5)',
                cursor: 'pointer',
                padding: 2,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(148, 163, 184, 0.5)';
              }}
              aria-label="Dismiss toast"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
