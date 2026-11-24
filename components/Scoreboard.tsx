'use client';

import React from 'react';
import { Player, ThemeConfig, ScoreState, GameMode } from '../lib/types';

interface ScoreboardProps {
  scores: ScoreState;
  currentTurn: Player;
  theme: ThemeConfig;
  gameMode: GameMode;
  player1Name: string;
  player2Name: string;
  isGameOver: boolean;
  onEditPlayerName: (player: Player, newName: string) => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  scores,
  currentTurn,
  theme,
  gameMode,
  player1Name,
  player2Name,
  isGameOver,
}) => {
  const isP1Turn = currentTurn === 'X' && !isGameOver;
  const isP2Turn = currentTurn === 'O' && !isGameOver;

  return (
    <div className="w-full max-w-[420px] mx-auto px-2 mb-2">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center">
        {/* Player 1 Card */}
        <div
          className={`
            relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300
            ${isP1Turn ? `bg-slate-800/90 border-cyan-400/80 shadow-lg ${theme.player1.glowClass} scale-[1.02]` : 'bg-slate-900/60 border-slate-800 opacity-80'}
          `}
        >
          {isP1Turn && (
            <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500 text-slate-950 shadow-sm animate-pulse">
              Turn
            </span>
          )}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xl sm:text-2xl">{theme.player1.symbol}</span>
            <span className="text-xs sm:text-sm font-semibold truncate max-w-[70px] sm:max-w-[85px] text-slate-200">
              {player1Name}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {scores.player1Wins}
          </div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Wins
          </span>
        </div>

        {/* Draws / Ties Card */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-slate-900/40 border-slate-800/80 text-center">
          <span className="text-xs font-semibold text-slate-400 mb-0.5">DRAWS</span>
          <div className="text-xl sm:text-2xl font-black text-slate-300">
            {scores.draws}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {scores.currentStreak.count > 1 ? (
              <span className="text-amber-400 font-medium">🔥 {scores.currentStreak.count} streak!</span>
            ) : (
              <span>vs</span>
            )}
          </div>
        </div>

        {/* Player 2 / AI Card */}
        <div
          className={`
            relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300
            ${isP2Turn ? `bg-slate-800/90 border-pink-400/80 shadow-lg ${theme.player2.glowClass} scale-[1.02]` : 'bg-slate-900/60 border-slate-800 opacity-80'}
          `}
        >
          {isP2Turn && (
            <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-pink-500 text-slate-950 shadow-sm animate-pulse">
              Turn
            </span>
          )}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xl sm:text-2xl">{theme.player2.symbol}</span>
            <span className="text-xs sm:text-sm font-semibold truncate max-w-[70px] sm:max-w-[85px] text-slate-200">
              {gameMode === 'ai' ? 'CPU' : player2Name}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {scores.player2Wins}
          </div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Wins
          </span>
        </div>
      </div>
    </div>
  );
};
