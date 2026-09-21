import React from 'react';
import { Gamepad2, Trophy, RotateCcw, Play, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import type { AppWindow } from '../../../types/os';
import { useOSStore } from '../../../store/osStore';
import { getApp } from '../../../data/apps';
import { useGameStatsStore } from './gameStatsStore';

interface GamesHubProps {
  window: AppWindow;
}

export default function GamesHub({ window: _appWindow }: GamesHubProps) {
  const openWindow = useOSStore((s) => s.openWindow);
  const stats = useGameStatsStore();

  const launchGame = (appId: string) => {
    const app = getApp(appId);
    if (app) openWindow(app);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#090a16',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa',
              }}
            >
              <Gamepad2 size={18} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '0.02em', color: '#f8fafc' }}>
              VNX.OS GAMES
            </h1>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 }}>
            Native desktop arcade collection. Designed for the developer operating system.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all game high scores and records?')) {
              stats.resetStats();
            }
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 11,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
          title="Clear all saved high scores and game records"
        >
          <RotateCcw size={12} /> Reset Stats
        </button>
      </div>

      {/* Game Cards Grid */}
      <div
        style={{
          flex: 1,
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 18,
          alignContent: 'start',
        }}
      >
        {/* Snake Card */}
        <div
          style={{
            background: 'rgba(15, 17, 30, 0.85)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.15s, border-color 0.15s',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                }}
              >
                <Zap size={20} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  background: 'rgba(52, 211, 153, 0.1)',
                  color: '#34d399',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                BEST: {stats.snakeHighScore}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>Snake</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              Classic grid-based arcade game with progressive speed tiers and collision detection.
            </div>
          </div>

          <button
            onClick={() => launchGame('snake')}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: 8,
              background: 'rgba(52, 211, 153, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34d399',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
          >
            <Play size={13} /> Play Snake
          </button>
        </div>

        {/* Impossible Tic Tac Toe Card */}
        <div
          style={{
            background: 'rgba(15, 17, 30, 0.85)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.15s, border-color 0.15s',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f43f5e',
                }}
              >
                <ShieldAlert size={20} />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'monospace',
                  background: 'rgba(244, 63, 94, 0.15)',
                  color: '#f43f5e',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  letterSpacing: '0.05em',
                }}
              >
                IMPOSSIBLE
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
              Impossible Tic Tac Toe
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              Can you force a draw? Powered by the minimax algorithm — mathematically unbeatable.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>DRAWS: {stats.ticTacToeDraws}</span>
              <span>AI WINS: {stats.ticTacToePlayerLosses}</span>
            </div>
            <button
              onClick={() => launchGame('tictactoe')}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: 8,
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                color: '#fb7185',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s',
              }}
            >
              <Play size={13} /> Play Tic Tac Toe
            </button>
          </div>
        </div>

        {/* Flappy Bird Card */}
        <div
          style={{
            background: 'rgba(15, 17, 30, 0.85)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.15s, border-color 0.15s',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                }}
              >
                <Sparkles size={20} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  background: 'rgba(251, 191, 36, 0.1)',
                  color: '#fbbf24',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                BEST: {stats.flappyHighScore}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
              Flappy Bird
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              One more run. Navigate the cyber conduits with gravity and impulse physics.
            </div>
          </div>

          <button
            onClick={() => launchGame('flappy')}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: 8,
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              color: '#fde047',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
          >
            <Play size={13} /> Play Flappy Bird
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          fontFamily: 'monospace',
          flexShrink: 0,
        }}
      >
        <span>CLIENT-SIDE RUNTIME • NO EXTERNAL TELEMETRY</span>
        <span>VNX.OS ARCADE ENGINE</span>
      </div>
    </div>
  );
}
