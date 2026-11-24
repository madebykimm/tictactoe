'use client';

import React from 'react';
import { sounds } from '../lib/audio';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onResetScores: () => void;
  canUndo: boolean;
  isMuted: boolean;
  onToggleSound: () => void;
  moveCount: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  onResetScores,
  canUndo,
  isMuted,
  onToggleSound,
  moveCount,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-2 mt-4 flex flex-col gap-2">
      {/* Primary New Game Action */}
      <button
        type="button"
        onClick={() => {
          sounds.playNewGame();
          onNewGame();
        }}
        className="w-full group relative flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-cyan-500/25 cursor-pointer"
      >
        <span className="text-lg transition-transform duration-300 group-hover:rotate-180">
          🔄
        </span>
        <span>New Game</span>
      </button>

      {/* Secondary Actions Row */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
            canUndo
              ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80 active:scale-95 cursor-pointer'
              : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
          }`}
          title="Undo last turn"
        >
          <span>↩️</span>
          <span>Undo</span>
        </button>

        <button
          type="button"
          onClick={onResetScores}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-slate-800/80 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
          title="Reset win/loss scoreboard"
        >
          <span>🗑️</span>
          <span>Reset Scores</span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          className="flex items-center justify-center py-2 px-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
          title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
        </button>
      </div>

      {/* Move Info */}
      <div className="text-center text-[11px] text-slate-500 mt-1">
        Moves played: <span className="font-semibold text-slate-400">{moveCount}</span> / 9
      </div>
    </div>
  );
};
