'use client';

import React from 'react';
import { Player, ThemeConfig } from '../lib/types';

interface CellProps {
  index: number;
  value: Player | null;
  isWinning: boolean;
  disabled: boolean;
  theme: ThemeConfig;
  currentTurn: Player;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  isWinning,
  disabled,
  theme,
  currentTurn,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getSymbol = (player: Player) => {
    return player === 'X' ? theme.player1.symbol : theme.player2.symbol;
  };

  const getColorClass = (player: Player) => {
    return player === 'X' ? theme.player1.accentClass : theme.player2.accentClass;
  };

  const getGlowClass = (player: Player) => {
    return player === 'X' ? theme.player1.glowClass : theme.player2.glowClass;
  };

  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const label = value
    ? `Row ${row}, Column ${col}, marked with ${value === 'X' ? theme.player1.label : theme.player2.label}`
    : `Row ${row}, Column ${col}, empty`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== null}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={label}
      className={`
        relative aspect-square rounded-2xl flex items-center justify-center
        transition-all duration-200 select-none outline-none
        border ${theme.cellBorder} ${theme.cellBg}
        ${!disabled && !value ? 'cursor-pointer hover:scale-[1.03] active:scale-95 hover:border-slate-500/80 shadow-md' : ''}
        ${value ? 'cursor-default' : ''}
        ${isWinning && value ? `scale-[1.05] ring-4 ring-offset-2 ring-offset-slate-950 ${getGlowClass(value)} z-10 animate-bounce-subtle` : ''}
      `}
    >
      {/* Placed Mark */}
      {value && (
        <span
          className={`
            text-5xl sm:text-6xl md:text-7xl font-black transition-transform duration-300
            ${getColorClass(value)}
            ${isWinning ? 'animate-pulse' : 'animate-scale-in'}
          `}
        >
          {getSymbol(value)}
        </span>
      )}

      {/* Ghost Preview on Hover */}
      {!value && isHovered && !disabled && (
        <span
          className={`
            text-4xl sm:text-5xl md:text-6xl font-black opacity-30 pointer-events-none transition-all duration-150 transform scale-90
            ${getColorClass(currentTurn)}
          `}
        >
          {getSymbol(currentTurn)}
        </span>
      )}
    </button>
  );
};
