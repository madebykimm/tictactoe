'use client';

import React from 'react';
import { GameMode, AIDifficulty } from '../lib/types';

interface ModeSelectorProps {
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  onChangeMode: (mode: GameMode) => void;
  onChangeDifficulty: (diff: AIDifficulty) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  gameMode,
  aiDifficulty,
  onChangeMode,
  onChangeDifficulty,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-2 mb-3">
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => onChangeMode('pvp')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
            gameMode === 'pvp'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <span>👥</span>
          <span>2 Players</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('ai')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
            gameMode === 'ai'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <span>🤖</span>
          <span>vs CPU</span>
        </button>
      </div>

      {/* AI Difficulty Selector if Mode is AI */}
      {gameMode === 'ai' && (
        <div className="mt-2 flex items-center justify-between gap-1.5 px-1 py-1 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-semibold uppercase px-2">
            CPU Level:
          </span>
          <div className="flex gap-1">
            {(['easy', 'medium', 'unbeatable'] as AIDifficulty[]).map((level) => {
              const labels = {
                easy: 'Chill',
                medium: 'Smart',
                unbeatable: 'Master',
              };
              const isSelected = aiDifficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChangeDifficulty(level)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                    isSelected
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
