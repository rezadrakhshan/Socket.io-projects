import { socket } from "./invite.js";
import { showToast } from "./invite.js";
import { botLoadingScreen } from "./index.js";

const container = document.querySelector(".container");

socket.on("game start", (data) => {
  showToast("Game Starting...");
  setTimeout(() => {
    botLoadingScreen.classList.add("bot-hidden");
    document.querySelector(
      "head"
    ).innerHTML += `<link rel="stylesheet" href="public/style/bot-game.css" />`;
    container.innerHTML = "";
    container.appendChild(generateGameBoard(data));
    container.innerHTML += `<hr color="#FFDDAB" />
      <div class="right-panel">
        <div class="info-box">
          <h2>Game Info</h2>
          <p><strong>Player:</strong> ${data.playerOne.username}</p>
          <p><strong>Opponent:</strong> ${data.playerTwo.username}</p>
          <p>
            <strong>Current Turn:</strong> <span id="current-turn">You</span>
          </p>
          <p>
            <strong>Status:</strong> <span id="game-status">In Progress</span>
          </p>
          <button id="reset-btn">Restart</button>
        </div>
      </div>`;
  }, 2000);
});

function generateGameBoard(data) {
  const boardHtml = document.createElement("div");
  boardHtml.className = "board";
  boardHtml.innerHTML = `<h1 class="title">${data.playerOne.username} VS ${data.playerTwo.username}</h1>`

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  for (let i = 0; i < 3; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const td = document.createElement("td");
      td.classList.add("cell");
      td.setAttribute("data-cell-index", i * 3 + j);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  boardHtml.appendChild(table);
  return boardHtml;
}
