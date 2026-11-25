'use client';

import { useSyncExternalStore } from 'react';
import { ScoreState, GameMode, AIDifficulty } from './types';

export const DEFAULT_SCORES: ScoreState = {
  player1Wins: 0,
  player2Wins: 0,
  draws: 0,
  currentStreak: { player: null, count: 0 },
  bestStreak: 0,
};

const STORAGE_EVENT = 'tictactoe-storage-event';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function notifyStorage() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

// 1. Stored Theme ID
export function useStoredTheme(defaultId: string = 'cyber'): [string, (id: string) => void] {
  const themeId = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem('tictactoe_theme') || defaultId;
      } catch {
        return defaultId;
      }
    },
    () => defaultId
  );

  const setThemeId = (id: string) => {
    try {
      localStorage.setItem('tictactoe_theme', id);
      notifyStorage();
    } catch {}
  };

  return [themeId, setThemeId];
}

// 2. Stored Game Mode
export function useStoredGameMode(defaultMode: GameMode = 'pvp'): [GameMode, (mode: GameMode) => void] {
  const mode = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const val = localStorage.getItem('tictactoe_mode') as GameMode;
        return val === 'pvp' || val === 'ai' ? val : defaultMode;
      } catch {
        return defaultMode;
      }
    },
    () => defaultMode
  );

  const setMode = (newMode: GameMode) => {
    try {
      localStorage.setItem('tictactoe_mode', newMode);
      notifyStorage();
    } catch {}
  };

  return [mode, setMode];
}

// 3. Stored AI Difficulty
export function useStoredDifficulty(
  defaultDiff: AIDifficulty = 'medium'
): [AIDifficulty, (diff: AIDifficulty) => void] {
  const diff = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const val = localStorage.getItem('tictactoe_diff') as AIDifficulty;
        return val === 'easy' || val === 'medium' || val === 'unbeatable' ? val : defaultDiff;
      } catch {
        return defaultDiff;
      }
    },
    () => defaultDiff
  );

  const setDifficulty = (newDiff: AIDifficulty) => {
    try {
      localStorage.setItem('tictactoe_diff', newDiff);
      notifyStorage();
    } catch {}
  };

  return [diff, setDifficulty];
}

// 4. Stored Scores with reference stability
let cachedScoresRaw: string | null = null;
let cachedScoresValue: ScoreState = DEFAULT_SCORES;

export function useStoredScores(): [
  ScoreState,
  (updater: ScoreState | ((prev: ScoreState) => ScoreState)) => void
] {
  const scores = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const raw = localStorage.getItem('tictactoe_scores');
        if (raw === cachedScoresRaw) {
          return cachedScoresValue;
        }
        if (!raw) {
          cachedScoresRaw = null;
          cachedScoresValue = DEFAULT_SCORES;
          return DEFAULT_SCORES;
        }
        cachedScoresRaw = raw;
        cachedScoresValue = JSON.parse(raw);
        return cachedScoresValue;
      } catch {
        return DEFAULT_SCORES;
      }
    },
    () => DEFAULT_SCORES
  );

  const setScores = (updater: ScoreState | ((prev: ScoreState) => ScoreState)) => {
    try {
      const nextValue = typeof updater === 'function' ? updater(cachedScoresValue) : updater;
      const raw = JSON.stringify(nextValue);
      localStorage.setItem('tictactoe_scores', raw);
      cachedScoresRaw = raw;
      cachedScoresValue = nextValue;
      notifyStorage();
    } catch {}
  };

  return [scores, setScores];
}
