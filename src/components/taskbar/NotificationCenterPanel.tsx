import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function LucideIcon({ name, size = 14 }: { name: string; size?: number }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = Icons[name];
  if (!Icon) return <Bell size={size} />;
  return <Icon size={size} />;
}

export default function NotificationCenterPanel() {
  const { notifications, dismissNotification, markNotificationRead, clearAllNotifications } = useSettingsStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      style={{
        position: 'fixed', top: 34, right: 8, width: 320, zIndex: 200,
        background: 'rgba(10,10,22,0.93)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: 8,
      }}>
        <Bell size={13} style={{ color: '#a78bfa' }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0', flex: 1 }}>
          Notifications
          {unread > 0 && (
            <span style={{
              marginLeft: 8, background: '#7c3aed', color: '#fff',
              fontSize: 9, padding: '1px 5px', borderRadius: 10, fontWeight: 700,
            }}>
              {unread}
            </span>
          )}
        </span>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            title="Clear all"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(148,163,184,0.6)', padding: 2,
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5,
            }}
          >
            <CheckCheck size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div style={{
              padding: '32px 16px', textAlign: 'center',
              color: 'rgba(148,163,184,0.4)', fontSize: 12,
            }}>
              <Bell size={28} style={{ margin: '0 auto 10px', opacity: 0.3, display: 'block' }} />
              No notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => markNotificationRead(notif.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: notif.read ? 'transparent' : 'rgba(139,92,246,0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: notif.read ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: notif.read ? 'rgba(148,163,184,0.5)' : '#a78bfa',
                }}>
                  <LucideIcon name={notif.icon || 'Bell'} size={14} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 600,
                      color: notif.read ? 'rgba(148,163,184,0.7)' : '#e2e8f0',
                    }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: '#7c3aed', flexShrink: 0,
                      }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 10.5, color: 'rgba(148,163,184,0.6)',
                    marginTop: 2, lineHeight: 1.4,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'rgba(100,116,139,0.7)', marginTop: 4 }}>
                    {notif.source} · {timeAgo(notif.timestamp)}
                  </div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(148,163,184,0.4)', padding: 2, flexShrink: 0,
                  }}
                >
                  <X size={11} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
