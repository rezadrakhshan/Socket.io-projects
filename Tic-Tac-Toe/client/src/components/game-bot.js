document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".board .cell");
  let board = Array(9).fill(null);
  const human = "X";
  const ai = "O";

  const evaluateWinner = (b) => {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6] 
    ];

    for (let [a,b1,c] of wins) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }

    if (!b.includes(null)) return "tie";
    return null;
  };

  const minimax = (newBoard, depth, isMaximizing, alpha, beta) => {
    const result = evaluateWinner(newBoard);
    if (result !== null) {
      if (result === ai) return 10 - depth;
      if (result === human) return depth - 10;
      return 0;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = ai;
          let eval = minimax(newBoard, depth + 1, false, alpha, beta);
          newBoard[i] = null;
          maxEval = Math.max(maxEval, eval);
          alpha = Math.max(alpha, eval);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = human;
          let eval = minimax(newBoard, depth + 1, true, alpha, beta);
          newBoard[i] = null;
          minEval = Math.min(minEval, eval);
          beta = Math.min(beta, eval);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const bestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = ai;
        let score = minimax(board, 0, false, -Infinity, Infinity);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    board[move] = ai;
    cells[move].innerHTML = `<span class="icon">${ai}</span>`;
    checkGameEnd();
  };

  const checkGameEnd = () => {
    let result = evaluateWinner(board);
    if (result === human) {
      setTimeout(() => alert("🎉You win"), 200);
    } else if (result === ai) {
      setTimeout(() => alert("🤖 AI Win"), 200);
    } else if (result === "tie") {
      setTimeout(() => alert("😐 Tie"), 200);
    }
  };

  cells.forEach((cell, idx) => {
    cell.addEventListener("click", () => {
      if (board[idx] === null && evaluateWinner(board) === null) {
        board[idx] = human;
        cell.innerHTML = `<span class="icon">${human}</span>`;
        checkGameEnd();
        if (evaluateWinner(board) === null) {
          setTimeout(bestMove, 300);
        }
      }
    });
  });
});
