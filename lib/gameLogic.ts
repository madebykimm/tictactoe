import { BoardState, Player, WinningLine, AIDifficulty } from './types';

export const WINNING_COMBINATIONS: { indices: [number, number, number]; direction: WinningLine['direction'] }[] = [
  // Rows
  { indices: [0, 1, 2], direction: 'horizontal-0' },
  { indices: [3, 4, 5], direction: 'horizontal-1' },
  { indices: [6, 7, 8], direction: 'horizontal-2' },
  // Columns
  { indices: [0, 3, 6], direction: 'vertical-0' },
  { indices: [1, 4, 7], direction: 'vertical-1' },
  { indices: [2, 5, 8], direction: 'vertical-2' },
  // Diagonals
  { indices: [0, 4, 8], direction: 'diagonal-main' },
  { indices: [2, 4, 6], direction: 'diagonal-anti' },
];

export function checkWinner(board: BoardState): { winner: Player; line: WinningLine } | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo.indices;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        line: combo,
      };
    }
  }
  return null;
}

export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  board.forEach((cell, idx) => {
    if (cell === null) moves.push(idx);
  });
  return moves;
}

/**
 * Minimax algorithm for Tic-Tac-Toe
 * Returns the best index for the AI player ('O')
 */
export function getAIMove(board: BoardState, difficulty: AIDifficulty): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // 1. Easy: Mostly random, 20% smart
  if (difficulty === 'easy') {
    if (Math.random() > 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // 2. Medium: Win if possible, block opponent if possible, else 50% random
  if (difficulty === 'medium') {
    // Check if AI can win in 1 move
    for (const move of availableMoves) {
      const copy = [...board];
      copy[move] = 'O';
      if (checkWinner(copy)?.winner === 'O') return move;
    }
    // Check if player can win in 1 move, block them
    for (const move of availableMoves) {
      const copy = [...board];
      copy[move] = 'X';
      if (checkWinner(copy)?.winner === 'X') return move;
    }
    // Center is strategic
    if (board[4] === null && Math.random() > 0.3) return 4;

    if (Math.random() > 0.5) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // 3. Unbeatable: Perfect Minimax
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = 'O';
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const winResult = checkWinner(board);
  if (winResult) {
    return winResult.winner === 'O' ? 10 - depth : depth - 10;
  }
  if (isBoardFull(board)) {
    return 0;
  }

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      board[move] = 'O';
      const evaluation = minimax(board, depth + 1, false, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      board[move] = 'X';
      const evaluation = minimax(board, depth + 1, true, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}
