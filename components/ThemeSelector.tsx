'use client';

import React from 'react';
import { ThemeConfig } from '../lib/types';
import { THEMES } from '../lib/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-2 mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <span>🎨 Style & Theme</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          {currentTheme.name}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {THEMES.map((theme) => {
          const isSelected = theme.id === currentTheme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              title={`${theme.name} (${theme.player1.symbol} vs ${theme.player2.symbol})`}
              className={`
                flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs transition-all duration-200
                ${isSelected 
                  ? 'bg-slate-800 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105 text-white' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <div className="flex items-center gap-0.5 text-base sm:text-lg mb-0.5">
                <span>{theme.player1.symbol}</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span>{theme.player2.symbol}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium truncate w-full text-center">
                {theme.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
