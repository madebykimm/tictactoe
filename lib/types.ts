export type Player = 'X' | 'O';
export type BoardState = (Player | null)[];

export type GameMode = 'pvp' | 'ai';
export type AIDifficulty = 'easy' | 'medium' | 'unbeatable';

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  player1: {
    symbol: string;
    label: string;
    color: string;
    accentClass: string;
    bgBadge: string;
    glowClass: string;
  };
  player2: {
    symbol: string;
    label: string;
    color: string;
    accentClass: string;
    bgBadge: string;
    glowClass: string;
  };
  boardBg: string;
  cellBg: string;
  cellBorder: string;
  appBg: string;
}

export interface WinningLine {
  indices: [number, number, number];
  direction: 'horizontal-0' | 'horizontal-1' | 'horizontal-2' | 
             'vertical-0' | 'vertical-1' | 'vertical-2' | 
             'diagonal-main' | 'diagonal-anti';
}

export interface ScoreState {
  player1Wins: number;
  player2Wins: number;
  draws: number;
  currentStreak: {
    player: Player | null;
    count: number;
  };
  bestStreak: number;
}
