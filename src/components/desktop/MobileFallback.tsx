import React from 'react';
import { Monitor } from 'lucide-react';

export default function MobileFallback() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100svh',
        background: 'linear-gradient(160deg, #070710 0%, #0a0520 60%, #04020c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 0 30px rgba(124,58,237,0.4)',
          fontSize: 28,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.02em',
        }}
      >
        V
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#a78bfa',
          letterSpacing: '0.2em',
          marginBottom: 8,
        }}
      >
        VNX.OS
      </div>

      <div
        style={{
          fontSize: 12,
          color: 'rgba(148,163,184,0.5)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: 36,
        }}
      >
        IDEAS &gt; CODE &gt; IMPACT
      </div>

      <div
        style={{
          padding: '24px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          maxWidth: 320,
        }}
      >
        <Monitor size={28} style={{ color: 'rgba(167,139,250,0.6)', marginBottom: 12 }} />
        <p style={{ fontSize: 15, fontWeight: 500, color: '#e2e8f0', marginBottom: 8 }}>
          Desktop Experience Required
        </p>
        <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)', lineHeight: 1.6 }}>
          VNX.OS is a full desktop operating system experience. Please visit from a laptop or desktop for the complete experience.
        </p>
      </div>

      <div style={{ marginTop: 32, fontSize: 12, color: 'rgba(100,116,139,0.4)' }}>
        Vansh Bhura — AI/ML Engineer
      </div>
    </div>
  );
}
