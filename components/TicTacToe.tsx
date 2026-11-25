'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BoardState, Player, ThemeConfig, GameMode, AIDifficulty, WinningLine } from '../lib/types';
import { THEMES } from '../lib/themes';
import { checkWinner, isBoardFull, getAIMove } from '../lib/gameLogic';
import { sounds } from '../lib/audio';
import {
  useStoredTheme,
  useStoredGameMode,
  useStoredDifficulty,
  useStoredScores,
  DEFAULT_SCORES,
} from '../lib/storage';
import { Board } from './Board';
import { Scoreboard } from './Scoreboard';
import { ThemeSelector } from './ThemeSelector';
import { ModeSelector } from './ModeSelector';
import { GameControls } from './GameControls';
import { WinnerModal } from './WinnerModal';

const INITIAL_BOARD: BoardState = Array(9).fill(null);

export const TicTacToe: React.FC = () => {
  // Game states
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [history, setHistory] = useState<BoardState[]>([INITIAL_BOARD]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Stored settings via useSyncExternalStore (completely prevents SSR hydration mismatch)
  const [themeId, setThemeId] = useStoredTheme('cyber');
  const [gameMode, setGameMode] = useStoredGameMode('pvp');
  const [aiDifficulty, setAiDifficulty] = useStoredDifficulty('medium');
  const [scores, setScores] = useStoredScores();

  const theme: ThemeConfig = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [player1Name, setPlayer1Name] = useState<string>('Player 1');
  const [player2Name, setPlayer2Name] = useState<string>('Player 2');

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state: AI is thinking whenever it is CPU's turn and game is ongoing
  const isAIThinking = gameMode === 'ai' && currentTurn === 'O' && !winner && !isDraw;

  // Handle game end
  const handleGameOver = useCallback((winResult: { winner: Player; line: WinningLine } | null, draw: boolean) => {
    if (winResult) {
      setWinner(winResult.winner);
      setWinningLine(winResult.line);
      setIsModalOpen(true);
      sounds.playWin();

      // Update score & streak
      setScores((prev) => {
        const isP1 = winResult.winner === 'X';
        const p1Wins = isP1 ? prev.player1Wins + 1 : prev.player1Wins;
        const p2Wins = !isP1 ? prev.player2Wins + 1 : prev.player2Wins;
        
        let newStreakCount = 1;
        if (prev.currentStreak.player === winResult.winner) {
          newStreakCount = prev.currentStreak.count + 1;
        }

        return {
          player1Wins: p1Wins,
          player2Wins: p2Wins,
          draws: prev.draws,
          currentStreak: {
            player: winResult.winner,
            count: newStreakCount,
          },
          bestStreak: Math.max(prev.bestStreak, newStreakCount),
        };
      });
    } else if (draw) {
      setIsDraw(true);
      setIsModalOpen(true);
      sounds.playDraw();

      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
        currentStreak: { player: null, count: 0 },
      }));
    }
  }, [setScores]);

  // Move handler
  const makeMove = useCallback((index: number, player: Player) => {
    setBoard((prevBoard) => {
      if (prevBoard[index] !== null || winner || isDraw) return prevBoard;

      const newBoard = [...prevBoard];
      newBoard[index] = player;

      sounds.playMove(player);

      setHistory((prev) => [...prev, newBoard]);

      // Check for win or draw
      const winResult = checkWinner(newBoard);
      if (winResult) {
        handleGameOver(winResult, false);
      } else if (isBoardFull(newBoard)) {
        handleGameOver(null, true);
      } else {
        // Toggle turn
        setCurrentTurn(player === 'X' ? 'O' : 'X');
      }

      return newBoard;
    });
  }, [winner, isDraw, handleGameOver]);

  // Player cell click
  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner || isDraw || isAIThinking) return;

    if (gameMode === 'ai' && currentTurn === 'O') {
      return; // Wait for AI
    }

    makeMove(index, currentTurn);
  };

  // AI Turn trigger
  useEffect(() => {
    if (gameMode === 'ai' && currentTurn === 'O' && !winner && !isDraw) {
      aiTimerRef.current = setTimeout(() => {
        const bestMove = getAIMove(board, aiDifficulty);
        if (bestMove !== -1) {
          makeMove(bestMove, 'O');
        }
      }, 420); // 420ms organic thinking delay
    }

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [currentTurn, gameMode, board, winner, isDraw, aiDifficulty, makeMove]);

  // Restart / New Game
  const handleNewGame = () => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    setBoard(INITIAL_BOARD);
    setHistory([INITIAL_BOARD]);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setIsModalOpen(false);
    setCurrentTurn('X');
  };

  // Undo move
  const handleUndo = () => {
    if (winner || isDraw || history.length <= 1) return;

    // In AI mode, undo both the AI move and user move if possible
    const stepsBack = gameMode === 'ai' && history.length > 2 ? 2 : 1;
    const targetIndex = history.length - 1 - stepsBack;
    const prevBoard = history[targetIndex];

    setHistory(history.slice(0, targetIndex + 1));
    setBoard(prevBoard);

    const movesMade = prevBoard.filter(Boolean).length;
    setCurrentTurn(movesMade % 2 === 0 ? 'X' : 'O');
    sounds.playClick();
  };

  // Reset scores
  const handleResetScores = () => {
    setScores(DEFAULT_SCORES);
    sounds.playClick();
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Select Theme
  const handleSelectTheme = (newTheme: ThemeConfig) => {
    setThemeId(newTheme.id);
    sounds.playClick();
  };

  // Change Game Mode
  const handleChangeMode = (mode: GameMode) => {
    setGameMode(mode);
    handleNewGame();
    sounds.playClick();
  };

  // Change AI Difficulty
  const handleChangeDifficulty = (diff: AIDifficulty) => {
    setAiDifficulty(diff);
    sounds.playClick();
  };

  const movesCount = board.filter(Boolean).length;
  const isGameOver = winner !== null || isDraw;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 transition-colors duration-500 bg-gradient-to-b ${theme.appBg} text-slate-100`}>
      {/* Background ambient decorative glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container Card */}
      <main className="w-full max-w-[460px] flex flex-col items-center">
        {/* Header Title */}
        <header className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-800/80 border border-slate-700/80 text-cyan-300 shadow-sm mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>3-in-a-Row Arena</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500">
            TIC • TAC • TOE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Crafted for style, playfulness, and victory.
          </p>
        </header>

        {/* Theme Selector */}
        <ThemeSelector
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />

        {/* Mode Selector (PvP vs CPU) */}
        <ModeSelector
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          onChangeMode={handleChangeMode}
          onChangeDifficulty={handleChangeDifficulty}
        />

        {/* Scoreboard */}
        <Scoreboard
          scores={scores}
          currentTurn={currentTurn}
          theme={theme}
          gameMode={gameMode}
          player1Name={player1Name}
          player2Name={player2Name}
          isGameOver={isGameOver}
          onEditPlayerName={(player, name) => {
            if (player === 'X') setPlayer1Name(name);
            else setPlayer2Name(name);
          }}
        />

        {/* Turn Status Toast / Pill */}
        <div className="my-1.5 flex items-center justify-center">
          {isGameOver ? (
            <div className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-800/90 border border-slate-700 text-slate-200 shadow-sm flex items-center gap-1.5">
              <span>{winner ? '🎉 Match Concluded!' : '🤝 Game Drawn!'}</span>
            </div>
          ) : isAIThinking ? (
            <div className="px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-700/80 text-purple-300 shadow-sm flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <span>CPU is thinking...</span>
            </div>
          ) : (
            <div className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 border border-slate-800 text-slate-300 shadow-sm flex items-center gap-1.5">
              <span>Next move:</span>
              <span className={`font-black ${currentTurn === 'X' ? theme.player1.accentClass : theme.player2.accentClass}`}>
                {currentTurn === 'X' ? `${player1Name} (${theme.player1.symbol})` : `${gameMode === 'ai' ? 'CPU' : player2Name} (${theme.player2.symbol})`}
              </span>
            </div>
          )}
        </div>

        {/* The 3x3 Board */}
        <Board
          board={board}
          winningLine={winningLine}
          disabled={isGameOver || isAIThinking}
          theme={theme}
          currentTurn={currentTurn}
          onCellClick={handleCellClick}
        />

        {/* Controls (New Game, Undo, Reset Scores, Mute) */}
        <GameControls
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          onResetScores={handleResetScores}
          canUndo={movesCount > 0 && !isGameOver && !isAIThinking}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          moveCount={movesCount}
        />

        {/* Winner Celebration Modal */}
        <WinnerModal
          isOpen={isModalOpen}
          winner={winner}
          isDraw={isDraw}
          theme={theme}
          player1Name={player1Name}
          player2Name={player2Name}
          gameMode={gameMode}
          onNewGame={handleNewGame}
          onClose={() => setIsModalOpen(false)}
        />
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-[11px] text-slate-500">
        Tic-Tac-Toe • First to line up 3 marks wins the round!
      </footer>
    </div>
  );
};
