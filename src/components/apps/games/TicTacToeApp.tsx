import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Cpu, Trophy, Sparkles, ShieldAlert, BarChart2 } from 'lucide-react';
import type { AppWindow } from '../../../types/os';
import { useGameStatsStore } from './gameStatsStore';

interface TicTacToeAppProps {
  window: AppWindow;
}

type Player = 'X' | 'O';
type CellValue = Player | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: CellValue[]): { winner: Player | 'DRAW' | null; line?: number[] } {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: combo };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: 'DRAW' };
  }

  return { winner: null };
}

// Minimax algorithm for unbeatable AI ('O' is maximizing player, 'X' is minimizing player)
function minimax(board: CellValue[], depth: number, isMaximizing: boolean): number {
  const { winner } = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'DRAW') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function findBestMove(board: CellValue[]): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

export default function TicTacToeApp({ window: appWindow }: TicTacToeAppProps) {
  const isFocused = appWindow.isFocused && appWindow.state !== 'minimized';
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player | 'DRAW' | null; line?: number[] }>({ winner: null });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [boardSize, setBoardSize] = useState<number>(280);

  const stats = useGameStatsStore();
  const recordResult = useGameStatsStore((s) => s.recordTicTacToeResult);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // ResizeObserver for board responsiveness
  useEffect(() => {
    const container = boardContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth > 0 && clientHeight > 0) {
        const side = Math.max(180, Math.min(clientWidth - 24, clientHeight - 24, 340));
        setBoardSize(side);
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Reset board
  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinnerInfo({ winner: null });
    setIsAiThinking(false);
  }, []);

  // Handle human move (Player = X)
  const handleCellClick = useCallback((index: number) => {
    if (board[index] !== null || winnerInfo.winner !== null || turn !== 'X' || isAiThinking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const check = checkWinner(newBoard);
    if (check.winner !== null) {
      setWinnerInfo(check);
      if (check.winner === 'DRAW') {
        recordResult('draw');
      } else if (check.winner === 'O') {
        recordResult('loss');
      }
      return;
    }

    setTurn('O');
    setIsAiThinking(true);
  }, [board, winnerInfo.winner, turn, isAiThinking, recordResult]);

  // Keyboard shortcut listener (1-9 for cells, R/Enter for new game)
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const key = e.key.toLowerCase();
      if (key === 'r' || key === 'enter') {
        e.preventDefault();
        startNewGame();
        return;
      }

      // Keys 1 to 9
      const num = parseInt(key, 10);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        e.preventDefault();
        handleCellClick(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, startNewGame, handleCellClick]);

  // AI turn execution with small micro-delay
  useEffect(() => {
    if (turn !== 'O' || winnerInfo.winner !== null) return;

    const timer = setTimeout(() => {
      const bestMove = findBestMove(board);
      if (bestMove !== -1) {
        const newBoard = [...board];
        newBoard[bestMove] = 'O';
        setBoard(newBoard);

        const check = checkWinner(newBoard);
        if (check.winner !== null) {
          setWinnerInfo(check);
          if (check.winner === 'DRAW') {
            recordResult('draw');
          } else if (check.winner === 'O') {
            recordResult('loss');
          }
        } else {
          setTurn('X');
        }
      }
      setIsAiThinking(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [turn, board, winnerInfo, recordResult]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#090a14',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em' }}>
              TIC TAC TOE
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(239, 68, 68, 0.18)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                letterSpacing: '0.08em',
              }}
            >
              IMPOSSIBLE
            </span>
          </div>
          <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2, fontFamily: 'monospace' }}>
            Powered by minimax algorithm.
          </div>
        </div>

        <button
          onClick={startNewGame}
          style={{
            background: 'rgba(124, 58, 237, 0.2)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            color: '#c4b5fd',
            padding: '5px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'background 0.15s',
          }}
        >
          <RotateCcw size={12} /> New Game
        </button>
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          fontSize: 11,
          fontFamily: 'monospace',
          flexShrink: 0,
        }}
      >
        <div>
          {winnerInfo.winner === null ? (
            turn === 'X' ? (
              <span style={{ color: '#38bdf8' }}>● YOUR TURN (X)</span>
            ) : (
              <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={12} className="animate-spin" /> AI COMPUTING (O)...
              </span>
            )
          ) : winnerInfo.winner === 'DRAW' ? (
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>RESULT: STALEMATE (DRAW)</span>
          ) : (
            <span style={{ color: '#f43f5e', fontWeight: 700 }}>RESULT: AI WON (O)</span>
          )}
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'flex', gap: 12, color: '#94a3b8' }}>
          <span>PLAYED: <strong style={{ color: '#f8fafc' }}>{stats.ticTacToeGamesPlayed}</strong></span>
          <span>DRAWS: <strong style={{ color: '#fbbf24' }}>{stats.ticTacToeDraws}</strong></span>
          <span>AI WINS: <strong style={{ color: '#f43f5e' }}>{stats.ticTacToePlayerLosses}</strong></span>
        </div>
      </div>

      {/* 3x3 Board Grid Container */}
      <div
        ref={boardContainerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: boardSize,
            height: boardSize,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 8,
            background: 'rgba(15, 18, 32, 0.8)',
            padding: 10,
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {board.map((cell, idx) => {
            const isWinningCell = winnerInfo.line?.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || winnerInfo.winner !== null || turn !== 'X' || isAiThinking}
                style={{
                  background: isWinningCell
                    ? 'rgba(244, 63, 94, 0.25)'
                    : cell !== null
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isWinningCell
                    ? '2px solid rgba(244, 63, 94, 0.8)'
                    : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: Math.max(22, Math.floor(boardSize / 6)),
                  fontWeight: 800,
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: cell === null && winnerInfo.winner === null && turn === 'X' && !isAiThinking ? 'pointer' : 'default',
                  color: cell === 'X' ? '#38bdf8' : cell === 'O' ? '#f43f5e' : 'transparent',
                  transition: 'background 0.15s, transform 0.1s',
                  boxShadow: cell === 'X' ? '0 0 12px rgba(56, 189, 248, 0.25)' : cell === 'O' ? '0 0 12px rgba(244, 63, 94, 0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (cell === null && winnerInfo.winner === null && turn === 'X' && !isAiThinking) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(56, 189, 248, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cell === null && !isWinningCell) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Reset Stats */}
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
      >
        <span>KEYS: 1-9 • R: NEW GAME • UNBEATABLE</span>
        <button
          onClick={() => {
            if (confirm('Reset Tic Tac Toe stats?')) {
              stats.resetStats();
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(148, 163, 184, 0.6)',
            cursor: 'pointer',
            fontSize: 10,
            textDecoration: 'underline',
          }}
        >
          Reset Stats
        </button>
      </div>
    </div>
  );
}
