import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';
import type { AppWindow } from '../../../types/os';
import { useGameStatsStore } from './gameStatsStore';

interface SnakeAppProps {
  window: AppWindow;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SPEED = 140; // ms per tick
const MIN_SPEED = 65;

// Lightweight Web Audio API retro synthesizer
function playRetroTone(type: 'eat' | 'die' | 'start') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'eat') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'die') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'start') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // AudioContext blocked or unsupported, silently ignore
  }
}

export default function SnakeApp({ window: appWindow }: SnakeAppProps) {
  const isFocused = appWindow.isFocused && appWindow.state !== 'minimized';
  const highScore = useGameStatsStore((s) => s.snakeHighScore);
  const setHighScore = useGameStatsStore((s) => s.setSnakeHighScore);

  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('IDLE');
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [boardSize, setBoardSize] = useState<number>(360);

  // Direction tracking
  const currentDirectionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('IDLE');
  gameStateRef.current = gameState;

  // Responsive board calculation via ResizeObserver
  useEffect(() => {
    const container = boardContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth > 0 && clientHeight > 0) {
        const side = Math.max(160, Math.min(clientWidth - 24, clientHeight - 24, 420));
        setBoardSize(side);
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Generate random food not on snake
  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  // Reset / start new game
  const startGame = useCallback(() => {
    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection('UP');
    currentDirectionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    setFood(spawnFood(initialSnake));
    setScore(0);
    setGameState('PLAYING');
    if (soundEnabled) playRetroTone('start');
  }, [spawnFood, soundEnabled]);

  // Pause when window loses focus or minimizes
  useEffect(() => {
    if (!isFocused && gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
    }
  }, [isFocused]);

  // Handle keyboard inputs safely
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if focus is in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // Ignore Alt, Ctrl, Meta modifier combos
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const key = e.key.toLowerCase();

      // Space / P to toggle pause or start
      if (key === ' ' || key === 'p') {
        e.preventDefault();
        if (gameStateRef.current === 'PLAYING') {
          setGameState('PAUSED');
        } else if (gameStateRef.current === 'PAUSED') {
          setGameState('PLAYING');
        } else if (gameStateRef.current === 'IDLE' || gameStateRef.current === 'GAMEOVER') {
          startGame();
        }
        return;
      }

      // R or Enter to restart
      if (key === 'r' || key === 'enter') {
        e.preventDefault();
        startGame();
        return;
      }

      if (gameStateRef.current !== 'PLAYING') return;

      // Check against nextDirectionRef to prevent fast double-press reverse suicide
      const cur = nextDirectionRef.current;

      if ((key === 'arrowup' || key === 'w') && cur !== 'DOWN') {
        e.preventDefault();
        nextDirectionRef.current = 'UP';
      } else if ((key === 'arrowdown' || key === 's') && cur !== 'UP') {
        e.preventDefault();
        nextDirectionRef.current = 'DOWN';
      } else if ((key === 'arrowleft' || key === 'a') && cur !== 'RIGHT') {
        e.preventDefault();
        nextDirectionRef.current = 'LEFT';
      } else if ((key === 'arrowright' || key === 'd') && cur !== 'LEFT') {
        e.preventDefault();
        nextDirectionRef.current = 'RIGHT';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, startGame]);

  // Game tick loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    // Calculate speed based on score (progressive difficulty)
    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 5) * 8);

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const dir = nextDirectionRef.current;
        setDirection(dir);
        currentDirectionRef.current = dir;

        switch (dir) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameState('GAMEOVER');
          if (soundEnabled) playRetroTone('die');
          return prevSnake;
        }

        // Self Collision
        const selfCollision = prevSnake.some((seg) => seg.x === head.x && seg.y === head.y);
        if (selfCollision) {
          setGameState('GAMEOVER');
          if (soundEnabled) playRetroTone('die');
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food Collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          setHighScore(newScore);
          setFood(spawnFood(newSnake));
          if (soundEnabled) playRetroTone('eat');
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, currentSpeed);

    return () => clearInterval(timer);
  }, [gameState, score, food, spawnFood, setHighScore, soundEnabled]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#090a12',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, monospace",
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top HUD Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', color: '#34d399' }}>
            SNAKE // ARCADE
          </span>
          <span
            style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              background: gameState === 'PLAYING' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              color: gameState === 'PLAYING' ? '#34d399' : '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            {gameState}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'monospace' }}>
            <span style={{ color: '#94a3b8' }}>SCORE:</span>
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>{score}</span>
          </div>

          {/* High Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: 'monospace' }}>
            <Trophy size={13} style={{ color: '#fbbf24' }} />
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{highScore}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((v) => !v)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: soundEnabled ? '#34d399' : '#64748b',
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

          {/* Quick Action Button */}
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
                background: 'rgba(52, 211, 153, 0.2)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34d399',
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
              <RotateCcw size={12} /> Restart
            </button>
          )}
        </div>
      </div>

      {/* Main Board Container */}
      <div
        ref={boardContainerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Game Grid Box — dynamically sized to fit perfectly */}
        <div
          style={{
            width: boardSize,
            height: boardSize,
            maxWidth: '100%',
            maxHeight: '100%',
            background: 'rgba(15, 17, 28, 0.95)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: 12,
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 0 24px rgba(0, 0, 0, 0.5)',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Grid Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: `${boardSize / GRID_SIZE}px ${boardSize / GRID_SIZE}px`,
              pointerEvents: 'none',
            }}
          />

          {/* Render Food */}
          <div
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              background: 'radial-gradient(circle, #f43f5e 30%, #be123c 100%)',
              borderRadius: '50%',
              margin: '15%',
              boxShadow: '0 0 10px #f43f5e, 0 0 4px #fda4af',
              zIndex: 2,
            }}
          />

          {/* Render Snake */}
          {snake.map((segment, idx) => {
            const isHead = idx === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${idx}`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  background: isHead
                    ? 'linear-gradient(135deg, #34d399, #059669)'
                    : 'linear-gradient(135deg, #10b981, #047857)',
                  borderRadius: isHead ? 5 : 3,
                  margin: '6%',
                  boxShadow: isHead ? '0 0 10px rgba(52, 211, 153, 0.9)' : 'none',
                  zIndex: isHead ? 3 : 1,
                }}
              />
            );
          })}

          {/* START SCREEN OVERLAY */}
          {gameState === 'IDLE' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(9, 10, 18, 0.88)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                zIndex: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: '#34d399', letterSpacing: '0.06em' }}>
                SNAKE
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
                Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move.<br />
                Press <strong>Space</strong> to pause • <strong>Enter</strong> to restart.
              </div>
              <button
                onClick={startGame}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'transform 0.1s',
                }}
              >
                <Play size={14} /> START GAME
              </button>
            </div>
          )}

          {/* PAUSE OVERLAY */}
          {gameState === 'PAUSED' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(9, 10, 18, 0.85)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                zIndex: 10,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.08em' }}>
                GAME PAUSED
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Press Space to resume</div>
              <button
                onClick={() => setGameState('PLAYING')}
                style={{
                  padding: '7px 18px',
                  borderRadius: 8,
                  background: '#34d399',
                  color: '#064e3b',
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

          {/* GAME OVER OVERLAY */}
          {gameState === 'GAMEOVER' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 7, 10, 0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                zIndex: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f43f5e', letterSpacing: '0.05em' }}>
                GAME OVER
              </div>
              <div style={{ fontSize: 12, color: '#cbd5e1', fontFamily: 'monospace' }}>
                FINAL SCORE: <strong style={{ color: '#fff' }}>{score}</strong>
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
                  ★ NEW HIGH SCORE!
                </div>
              )}
              <button
                onClick={startGame}
                style={{
                  marginTop: 6,
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
                <RotateCcw size={13} /> PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10.5,
          color: '#64748b',
          fontFamily: 'monospace',
          flexShrink: 0,
        }}
      >
        <span>ARROWS / WASD • SPACE: PAUSE • R: RESTART</span>
        <span>SPEED: {Math.max(1, 1 + Math.floor(score / 10))}X</span>
      </div>
    </div>
  );
}
