document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".board .cell");
  const turnStatus = document.getElementById("current-turn");
  const resetBtn = document.getElementById("reset-btn");
  const gameStatus = document.getElementById("game-status");

  let board = Array(9).fill(null);
  const human = "X";
  const ai = "O";

  const evaluateWinner = (b) => {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b1, c] of wins) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return { winner: b[a], line: [a, b1, c] };
      }
    }
    if (!b.includes(null)) return { winner: "tie" };
    return null;
  };

  const minimax = (newBoard, depth, isMax, alpha, beta) => {
    const result = evaluateWinner(newBoard);
    if (result) {
      if (result.winner === ai) return 10 - depth;
      if (result.winner === human) return depth - 10;
      return 0;
    }

    if (isMax) {
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
    if (move !== undefined) {
      setTimeout(() => {
        board[move] = ai;
        cells[move].innerHTML = `<span class="icon">${ai}</span>`;
        nextTurn();
      }, 400);
    }
  };

  const showEndGame = (result) => {
    if (result.winner === human) {
      turnStatus.innerText = "You";
      gameStatus.innerText = "You Wins";
    } else if (result.winner === ai) {
      turnStatus.innerText = "AI";
      result.line.forEach((i) => {
        cells[i].classList.add("winning");
      });
      gameStatus.innerText = "AI Wins";
    } else if (result.winner === "tie") {
      gameStatus.innerText = "Tie";
    }
  };

  const nextTurn = () => {
    const result = evaluateWinner(board);
    if (result) {
      showEndGame(result);
      return;
    }

    const isHumanTurn = board.filter((v) => v !== null).length % 2 === 0;
    turnStatus.innerText = isHumanTurn ? "You" : "AI";

    if (!isHumanTurn) {
      bestMove();
    }
  };

  cells.forEach((cell, idx) => {
    cell.addEventListener("click", () => {
      if (board[idx] === null && !evaluateWinner(board)) {
        board[idx] = human;
        cell.innerHTML = `<span class="icon">${human}</span>`;
        nextTurn();
      }
    });
  });

  resetBtn.addEventListener("click", () => {
    board = Array(9).fill(null);
    cells.forEach((c) => {
      c.innerHTML = "";
      c.classList.remove("winning");
    });
    turnStatus.innerText = "You";
    gameStatus.innerText = "In Progress";
  });

  nextTurn();
});
