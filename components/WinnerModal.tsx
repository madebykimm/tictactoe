'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player, ThemeConfig } from '../lib/types';
import { sounds } from '../lib/audio';

interface WinnerModalProps {
  isOpen: boolean;
  winner: Player | null;
  isDraw: boolean;
  theme: ThemeConfig;
  player1Name: string;
  player2Name: string;
  gameMode: string;
  onNewGame: () => void;
  onClose: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  winner,
  isDraw,
  theme,
  player1Name,
  player2Name,
  gameMode,
  onNewGame,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && winner) {
      // Fire confetti burst
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  const winnerName = winner === 'X' 
    ? player1Name 
    : (gameMode === 'ai' ? 'CPU' : player2Name);

  const winnerSymbol = winner === 'X' ? theme.player1.symbol : theme.player2.symbol;
  const winnerColorClass = winner === 'X' ? theme.player1.accentClass : theme.player2.accentClass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-700/80 shadow-2xl text-center transform transition-all duration-300 animate-scale-up"
      >
        {/* Glow behind modal */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10" />

        {winner && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <span className="text-6xl sm:text-7xl animate-bounce-subtle inline-block">
                {winnerSymbol}
              </span>
              <span className="absolute -bottom-2 -right-2 text-2xl">👑</span>
            </div>

            <div className="text-xs font-bold tracking-widest text-cyan-400 uppercase mb-1">
              Victory Royale!
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              <span className={winnerColorClass}>{winnerName}</span> Wins!
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Three in a row! Amazing game strategy.
            </p>
          </div>
        )}

        {isDraw && (
          <div className="flex flex-col items-center">
            <span className="text-6xl sm:text-7xl mb-3 animate-pulse inline-block">
              🤝
            </span>

            <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-1">
              Stalemate
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              It&apos;s a Draw!
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              A dead heat! Neither side gave an inch.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={() => {
              sounds.playNewGame();
              onNewGame();
            }}
            className="w-full py-3 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 active:scale-95 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
          >
            Play Again (New Game)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            Inspect Board
          </button>
        </div>
      </div>
    </div>
  );
};
