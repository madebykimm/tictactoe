'use client';

import React from 'react';
import { BoardState, Player, ThemeConfig, WinningLine } from '../lib/types';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardState;
  winningLine: WinningLine | null;
  disabled: boolean;
  theme: ThemeConfig;
  currentTurn: Player;
  onCellClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winningLine,
  disabled,
  theme,
  currentTurn,
  onCellClick,
}) => {
  const isWinningCell = (index: number) => {
    return winningLine ? winningLine.indices.includes(index as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) : false;
  };

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px] mx-auto p-4 sm:p-5 rounded-3xl transition-all duration-300">
      {/* Outer Glow & Background */}
      <div
        className={`relative grid grid-cols-3 gap-3 sm:gap-4 p-4 rounded-3xl border transition-all duration-300 ${theme.boardBg}`}
      >
        {board.map((cellValue, idx) => (
          <Cell
            key={idx}
            index={idx}
            value={cellValue}
            isWinning={isWinningCell(idx)}
            disabled={disabled}
            theme={theme}
            currentTurn={currentTurn}
            onClick={() => onCellClick(idx)}
          />
        ))}
      </div>
    </div>
  );
};
