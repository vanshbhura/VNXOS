import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';
import type { AppWindow } from '../../../types/os';
import { useGameStatsStore } from './gameStatsStore';

interface FlappyBirdAppProps {
  window: AppWindow;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

const GRAVITY = 0.36;
const JUMP = -6.6;
const PIPE_WIDTH = 52;
const PIPE_GAP = 135;
const INITIAL_SPEED = 2.2;

// Retro Web Audio sound effects
function playFlappySound(type: 'flap' | 'score' | 'crash') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'flap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'score') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.06); // A5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'crash') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // ignore audio block
  }
}

export default function FlappyBirdApp({ window: appWindow }: FlappyBirdAppProps) {
  const isFocused = appWindow.isFocused && appWindow.state !== 'minimized';
  const highScore = useGameStatsStore((s) => s.flappyHighScore);
  const setHighScore = useGameStatsStore((s) => s.setFlappyHighScore);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Physics state in refs for 60fps RAF loop
  const birdRef = useRef<{ y: number; vy: number; rotation: number }>({ y: 220, vy: 0, rotation: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef(0);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('IDLE');
  const rafIdRef = useRef<number | null>(null);

  // Sync state ref
  gameStateRef.current = gameState;

  // Start game
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    const initialY = canvas ? Math.floor(canvas.height / 2) : 220;
    birdRef.current = { y: initialY, vy: -3, rotation: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    frameCountRef.current = 0;
    setScore(0);
    setGameState('PLAYING');
    if (soundEnabled) playFlappySound('flap');
  }, [soundEnabled]);

  // Jump action
  const flap = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      birdRef.current.vy = JUMP;
      if (soundEnabled) playFlappySound('flap');
    } else if (gameStateRef.current === 'IDLE' || gameStateRef.current === 'GAMEOVER') {
      startGame();
    }
  }, [startGame, soundEnabled]);

  // Auto-pause when window loses focus
  useEffect(() => {
    if (!isFocused && gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
    }
  }, [isFocused]);

  // Keyboard controls
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.altKey || e.ctrlKey || e.metaKey) return;

      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        flap();
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (gameStateRef.current === 'PLAYING') setGameState('PAUSED');
        else if (gameStateRef.current === 'PAUSED') setGameState('PLAYING');
      } else if (e.key.toLowerCase() === 'r' || e.key === 'Enter') {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, flap, startGame]);

  // Canvas drawing function
  const renderFrame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sky Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#090a18');
    bgGrad.addColorStop(0.65, '#12132b');
    bgGrad.addColorStop(1, '#05060d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Star / Grid dust
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 20; i++) {
      const sx = ((i * 37) + frameCountRef.current * 0.2) % width;
      const sy = (i * 29) % Math.max(10, height - 40);
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Pipes (Cyber Neon Pillars)
    for (const pipe of pipesRef.current) {
      // Top Pipe
      const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      pipeGrad.addColorStop(0, 'rgba(124, 58, 237, 0.7)');
      pipeGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.9)');
      pipeGrad.addColorStop(1, 'rgba(124, 58, 237, 0.7)');

      ctx.fillStyle = pipeGrad;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.fillStyle = '#c4b5fd';
      ctx.fillRect(pipe.x - 2, pipe.topHeight - 8, PIPE_WIDTH + 4, 8);

      // Bottom Pipe
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, Math.max(0, height - pipe.bottomY));
      ctx.fillStyle = '#c4b5fd';
      ctx.fillRect(pipe.x - 2, pipe.bottomY, PIPE_WIDTH + 4, 8);
    }

    // Ground
    ctx.fillStyle = 'rgba(10, 12, 24, 0.95)';
    ctx.fillRect(0, height - 20, width, 20);
    ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
    ctx.fillRect(0, height - 20, width, 2);

    // Player Drone
    const bird = birdRef.current;
    const birdX = 70;

    ctx.save();
    ctx.translate(birdX, bird.y);
    ctx.rotate(bird.rotation);

    // Thruster Flame
    if (gameStateRef.current === 'PLAYING') {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-16, -2);
      ctx.lineTo(-24 - Math.random() * 6, 0);
      ctx.lineTo(-16, 2);
      ctx.fill();
    }

    // Drone Body
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-3, 2, 8, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(7, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(8.5, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(12, -1);
    ctx.lineTo(19, 2);
    ctx.lineTo(12, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // In-canvas score readout
    if (gameStateRef.current === 'PLAYING') {
      ctx.font = 'bold 28px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(`${scoreRef.current}`, width / 2, 50);
    }
  }, []);

  // ResizeObserver to keep canvas sharp and 1:1 with container
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) renderFrame(ctx, w, h);
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => ro.disconnect();
  }, [renderFrame]);

  // Main RAF Loop — ONLY active when gameState === 'PLAYING' and isFocused!
  useEffect(() => {
    if (gameState !== 'PLAYING' || !isFocused) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      // Draw static frame for current state
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) renderFrame(ctx, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const loop = () => {
      if (!active || gameStateRef.current !== 'PLAYING') return;

      const width = canvas.width;
      const height = canvas.height;

      frameCountRef.current += 1;
      const currentSpeed = INITIAL_SPEED + Math.min(2.0, scoreRef.current * 0.08);

      // Bird physics
      const bird = birdRef.current;
      bird.vy += GRAVITY;
      bird.y += bird.vy;
      bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.vy * 0.08));

      // Floor / Ceiling collision
      const birdRadius = 14;
      if (bird.y + birdRadius >= height - 20) {
        bird.y = height - 20 - birdRadius;
        setGameState('GAMEOVER');
        if (soundEnabled) playFlappySound('crash');
        return;
      } else if (bird.y - birdRadius <= 0) {
        bird.y = birdRadius;
        bird.vy = 0;
      }

      // Spawn pipes
      const spawnRate = Math.max(75, 105 - Math.floor(scoreRef.current / 4) * 4);
      if (frameCountRef.current % spawnRate === 0) {
        const minPipeH = 50;
        const maxPipeH = Math.max(minPipeH + 10, height - PIPE_GAP - minPipeH - 30);
        const topH = Math.floor(Math.random() * (maxPipeH - minPipeH)) + minPipeH;
        pipesRef.current.push({
          x: width,
          topHeight: topH,
          bottomY: topH + PIPE_GAP,
          passed: false,
        });
      }

      // Update & check pipes
      const birdX = 70;
      const remainingPipes: Pipe[] = [];

      for (const pipe of pipesRef.current) {
        pipe.x -= currentSpeed;

        // Check pass
        if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
          pipe.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
          setHighScore(scoreRef.current);
          if (soundEnabled) playFlappySound('score');
        }

        // Collision check
        if (birdX + birdRadius > pipe.x && birdX - birdRadius < pipe.x + PIPE_WIDTH) {
          if (bird.y - birdRadius < pipe.topHeight || bird.y + birdRadius > pipe.bottomY) {
            setGameState('GAMEOVER');
            if (soundEnabled) playFlappySound('crash');
            return;
          }
        }

        if (pipe.x + PIPE_WIDTH > -20) {
          remainingPipes.push(pipe);
        }
      }

      pipesRef.current = remainingPipes;

      // Render
      renderFrame(ctx, width, height);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [gameState, isFocused, renderFrame, setHighScore, soundEnabled]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#070810',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
      onClick={flap}
    >
      {/* Top HUD */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          zIndex: 10,
          flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.04em' }}>
            FLAPPY BIRD
          </span>
          <span
            style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              background: gameState === 'PLAYING' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              color: gameState === 'PLAYING' ? '#fbbf24' : '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            {gameState}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'monospace' }}>
            <span style={{ color: '#94a3b8' }}>SCORE:</span>
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>{score}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'monospace' }}>
            <Trophy size={13} style={{ color: '#fbbf24' }} />
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{highScore}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((v) => !v)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: soundEnabled ? '#fbbf24' : '#64748b',
              padding: '4px 6px',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={soundEnabled ? 'Mute Game Sound' : 'Enable Game Sound'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {gameState === 'PLAYING' ? (
            <button
              onClick={() => setGameState('PAUSED')}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '4px 8px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
            >
              <Pause size={12} /> Pause
            </button>
          ) : gameState === 'PAUSED' ? (
            <button
              onClick={() => setGameState('PLAYING')}
              style={{
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24',
                padding: '4px 8px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
            >
              <Play size={12} /> Resume
            </button>
          ) : (
            <button
              onClick={startGame}
              style={{
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                color: '#c4b5fd',
                padding: '4px 8px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
            >
              <RotateCcw size={12} /> Start
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* START OVERLAY */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(7, 8, 16, 0.85)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              zIndex: 5,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.04em' }}>
              FLAPPY BIRD
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
              Click anywhere or press <strong>Space</strong> / <strong>Arrow Up</strong> to flap.<br />
              Navigate through the cyber conduits!
            </div>
            <button
              onClick={startGame}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Play size={15} /> PLAY NOW
            </button>
          </div>
        )}

        {/* PAUSED OVERLAY */}
        {gameState === 'PAUSED' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(7, 8, 16, 0.85)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              zIndex: 5,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>PAUSED</div>
            <button
              onClick={() => setGameState('PLAYING')}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: '#fbbf24',
                color: '#451a03',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              RESUME
            </button>
          </div>
        )}

        {/* GAMEOVER OVERLAY */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 6, 12, 0.9)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              zIndex: 5,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f43f5e', letterSpacing: '0.04em' }}>
              CRASHED!
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', fontFamily: 'monospace' }}>
              SCORE: <strong style={{ color: '#fff' }}>{score}</strong>
            </div>
            {score >= highScore && score > 0 && (
              <div
                style={{
                  fontSize: 11,
                  color: '#fbbf24',
                  background: 'rgba(251, 191, 36, 0.1)',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                ★ NEW BEST SCORE!
              </div>
            )}
            <button
              onClick={startGame}
              style={{
                marginTop: 8,
                padding: '8px 20px',
                borderRadius: 8,
                background: '#f43f5e',
                color: '#fff',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 16px rgba(244, 63, 94, 0.4)',
              }}
            >
              <RotateCcw size={13} /> TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10.5,
          color: '#64748b',
          fontFamily: 'monospace',
          flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span>CLICK / SPACE TO FLAP • P TO PAUSE</span>
        <span>ONE MORE RUN</span>
      </div>
    </div>
  );
}
