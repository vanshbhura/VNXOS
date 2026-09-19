import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sun, Power } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useOSStore } from '../../store/osStore';
import { BOOT_KEY } from './BootScreen';
import { useTime } from '../../hooks/useTime';

// ─── Lock Screen ──────────────────────────────────────────────────────────────

function LockScreen() {
  const setPowerState = useSettingsStore((s) => s.setPowerState);
  const { timeStr, dateStr } = useTime();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const unlock = () => {
    // Always unlock (no real auth)
    setPowerState('running');
    setPin('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') unlock();
  };

  const handleWrongPin = () => {
    if (pin.length > 0) {
      unlock(); // any input unlocks
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: `
          radial-gradient(ellipse at 30% 60%, rgba(55,14,100,0.6) 0%, transparent 55%),
          radial-gradient(ellipse at 70% 30%, rgba(15,50,120,0.5) 0%, transparent 50%),
          linear-gradient(175deg, #030308 0%, #0a0520 50%, #020208 100%)
        `,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24,
        backdropFilter: 'blur(0px)',
      }}
      onClick={(e) => e.target === e.currentTarget && unlock()}
    >
      {/* Clock */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: 'rgba(226,232,240,0.95)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {timeStr}
        </div>
        <div style={{ fontSize: 16, color: 'rgba(148,163,184,0.7)', marginTop: 8, letterSpacing: '0.08em' }}>
          {dateStr}
        </div>
      </div>

      {/* User avatar */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, fontWeight: 700, color: '#fff',
        boxShadow: '0 0 0 3px rgba(139,92,246,0.3), 0 8px 30px rgba(0,0,0,0.5)',
      }}>
        V
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Vansh Bhura</div>
        <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>VNX.OS User</div>
      </div>

      {/* PIN / click to unlock */}
      <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
      >
        <input
          autoFocus
          type="password"
          placeholder="Click here or press Enter to unlock"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={handleKey}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 30, padding: '10px 20px',
            color: '#e2e8f0', fontSize: 13,
            outline: 'none', textAlign: 'center', width: 240,
            backdropFilter: 'blur(8px)',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleWrongPin}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 24px', borderRadius: 30, cursor: 'pointer',
            background: 'rgba(139,92,246,0.25)',
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#c4b5fd', fontSize: 13, fontWeight: 600,
          }}
        >
          <Lock size={13} />
          Unlock
        </motion.button>
      </motion.div>

      <div style={{ fontSize: 10.5, color: 'rgba(100,116,139,0.5)', marginTop: 8 }}>
        Press Enter or click Unlock to continue
      </div>
    </motion.div>
  );
}

// ─── Sleep Screen ─────────────────────────────────────────────────────────────

function SleepScreen() {
  const setPowerState = useSettingsStore((s) => s.setPowerState);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        gap: 16,
      }}
      onClick={() => setPowerState('running')}
    >
      <motion.div
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{ textAlign: 'center' }}
      >
        <Sun size={32} style={{ color: 'rgba(167,139,250,0.5)', margin: '0 auto 12px', display: 'block' }} />
        <div style={{ fontSize: 15, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.1em' }}>
          VNX.OS — Sleeping
        </div>
        <div style={{ fontSize: 11, color: 'rgba(100,116,139,0.35)', marginTop: 8 }}>
          Click anywhere to wake
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Shutdown Screen ──────────────────────────────────────────────────────────

function ShutdownScreen() {
  const setPowerState = useSettingsStore((s) => s.setPowerState);
  const setBootComplete = useOSStore((s) => s.setBootComplete);

  const powerOn = () => {
    // Replay boot sequence by clearing boot flag
    localStorage.removeItem(BOOT_KEY);
    setPowerState('running');
    setBootComplete(false);
    setTimeout(() => setBootComplete(true), 50);
    // Easiest approach: just reload page to replay boot
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20,
      }}
    >
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ color: 'rgba(139,92,246,0.6)' }}
      >
        <Power size={40} />
      </motion.div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: 'rgba(148,163,184,0.5)', letterSpacing: '0.1em' }}>
          VNX.OS — Powered Off
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={powerOn}
        style={{
          marginTop: 12, padding: '10px 28px', borderRadius: 30, cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(59,130,246,0.4))',
          border: '1px solid rgba(139,92,246,0.4)',
          color: '#c4b5fd', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 0 20px rgba(124,58,237,0.2)',
        }}
      >
        <Power size={14} />
        Power On VNX.OS
      </motion.button>
    </motion.div>
  );
}

// ─── Brightness overlay ───────────────────────────────────────────────────────

function BrightnessOverlay() {
  const brightness = useSettingsStore((s) => s.simulatedBrightness);
  const opacity = Math.max(0, (100 - brightness) / 100) * 0.85;

  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        background: `rgba(0,0,0,${opacity})`,
        pointerEvents: 'none',
        transition: 'background 0.3s',
      }}
    />
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function PowerOverlays() {
  const powerState = useSettingsStore((s) => s.powerState);

  return (
    <>
      <BrightnessOverlay />
      <AnimatePresence>
        {powerState === 'locked' && <LockScreen key="lock" />}
        {powerState === 'sleeping' && <SleepScreen key="sleep" />}
        {powerState === 'shutdown' && <ShutdownScreen key="shutdown" />}
      </AnimatePresence>
    </>
  );
}
