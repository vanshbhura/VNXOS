import { create } from 'zustand';

export interface GameStats {
  snakeHighScore: number;
  ticTacToeGamesPlayed: number;
  ticTacToeDraws: number;
  ticTacToePlayerLosses: number;
  flappyHighScore: number;
}

interface GameStatsStore extends GameStats {
  setSnakeHighScore: (score: number) => void;
  recordTicTacToeResult: (result: 'draw' | 'loss') => void;
  setFlappyHighScore: (score: number) => void;
  resetStats: () => void;
}

const STATS_STORAGE_KEY = 'vnxos.game_stats.v1';

const defaultStats: GameStats = {
  snakeHighScore: 0,
  ticTacToeGamesPlayed: 0,
  ticTacToeDraws: 0,
  ticTacToePlayerLosses: 0,
  flappyHighScore: 0,
};

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        snakeHighScore: typeof parsed.snakeHighScore === 'number' && !isNaN(parsed.snakeHighScore) ? parsed.snakeHighScore : 0,
        ticTacToeGamesPlayed: typeof parsed.ticTacToeGamesPlayed === 'number' && !isNaN(parsed.ticTacToeGamesPlayed) ? parsed.ticTacToeGamesPlayed : 0,
        ticTacToeDraws: typeof parsed.ticTacToeDraws === 'number' && !isNaN(parsed.ticTacToeDraws) ? parsed.ticTacToeDraws : 0,
        ticTacToePlayerLosses: typeof parsed.ticTacToePlayerLosses === 'number' && !isNaN(parsed.ticTacToePlayerLosses) ? parsed.ticTacToePlayerLosses : 0,
        flappyHighScore: typeof parsed.flappyHighScore === 'number' && !isNaN(parsed.flappyHighScore) ? parsed.flappyHighScore : 0,
      };
    }
  } catch {
    // ignore
  }
  return { ...defaultStats };
}

function saveStats(stats: GameStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export const useGameStatsStore = create<GameStatsStore>((set, get) => ({
  ...loadStats(),

  setSnakeHighScore: (score: number) => {
    if (score > get().snakeHighScore) {
      set({ snakeHighScore: score });
      saveStats({
        snakeHighScore: score,
        ticTacToeGamesPlayed: get().ticTacToeGamesPlayed,
        ticTacToeDraws: get().ticTacToeDraws,
        ticTacToePlayerLosses: get().ticTacToePlayerLosses,
        flappyHighScore: get().flappyHighScore,
      });
    }
  },

  recordTicTacToeResult: (result: 'draw' | 'loss') => {
    const gamesPlayed = get().ticTacToeGamesPlayed + 1;
    const draws = result === 'draw' ? get().ticTacToeDraws + 1 : get().ticTacToeDraws;
    const playerLosses = result === 'loss' ? get().ticTacToePlayerLosses + 1 : get().ticTacToePlayerLosses;

    set({
      ticTacToeGamesPlayed: gamesPlayed,
      ticTacToeDraws: draws,
      ticTacToePlayerLosses: playerLosses,
    });

    saveStats({
      snakeHighScore: get().snakeHighScore,
      ticTacToeGamesPlayed: gamesPlayed,
      ticTacToeDraws: draws,
      ticTacToePlayerLosses: playerLosses,
      flappyHighScore: get().flappyHighScore,
    });
  },

  setFlappyHighScore: (score: number) => {
    if (score > get().flappyHighScore) {
      set({ flappyHighScore: score });
      saveStats({
        snakeHighScore: get().snakeHighScore,
        ticTacToeGamesPlayed: get().ticTacToeGamesPlayed,
        ticTacToeDraws: get().ticTacToeDraws,
        ticTacToePlayerLosses: get().ticTacToePlayerLosses,
        flappyHighScore: score,
      });
    }
  },

  resetStats: () => {
    set({ ...defaultStats });
    saveStats(defaultStats);
  },
}));
