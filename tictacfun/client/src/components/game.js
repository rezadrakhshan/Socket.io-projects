import { socket, id } from "./invite.js";
import { showToast } from "./invite.js";
import { botLoadingScreen } from "./index.js";
import { sidebar, overlay } from "./friend.js";

const container = document.querySelector(".container");

socket.on("game start", (data) => {
  showToast("Game Starting...");
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
  setTimeout(() => {
    botLoadingScreen.classList.add("bot-hidden");
    document.querySelector(
      "head"
    ).innerHTML += `<link rel="stylesheet" href="public/style/bot-game.css" />`;
    container.innerHTML = "";
    container.appendChild(generateGameBoard(data));
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("chat-container");
    chatContainer.innerHTML = `  <h1 class="chat-title">Chat with opponent</h1>
  
  <div class="chat-messages">
  </div>
  
  <form class="chat-form">
    <input name="message" required type="text" placeholder="Type a message..." />
    <button type="submit">Send</button>
  </form>`;
    container.appendChild(chatContainer);
    setUpGameEvent(data);
    chatEvent(data.roomID);
  }, 2000);
});

function generateGameBoard(data) {
  const leftSide = document.createElement("div");
  leftSide.classList.add("left-panel");
  const boardHtml = document.createElement("div");
  boardHtml.className = "board";
  boardHtml.innerHTML = `<h1 class="title">${data.playerOne._doc.username}(${data.playerOne.symbol}) VS ${data.playerTwo._doc.username}(${data.playerTwo.symbol})</h1>`;

  const table = document.createElement("table");
  table.style.marginLeft = "10%";
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
  leftSide.appendChild(boardHtml);
  return leftSide;
}

function setUpGameEvent(data) {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.textContent != "") return;
      socket.emit("player move", {
        index: item.getAttribute("data-cell-index"),
        roomID: data.roomID,
      });
    });
  });
}

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

socket.on("player move", (data) => {
  const cell = document.querySelector(`[data-cell-index="${data.index}"]`);
  cell.innerHTML = `<span class="icon">${data.symbol}</span>`;

  const currentBoard = Array.from(document.querySelectorAll(".cell")).map(
    (cell) => (cell.textContent.trim() === "" ? null : cell.textContent.trim())
  );

  const result = evaluateWinner(currentBoard);

  if (result) {
    if (result.winner === "tie") {
      showToast("It's a tie!");
    } else {
      showToast(`${result.winner} wins!`);

      result.line.forEach((i) => {
        const winCell = document.querySelector(`[data-cell-index="${i}"]`);
        winCell.classList.add("winner");
      });
    }
    let sec = 5;
    const reloadTime = setInterval(() => {
      if (sec > 0) {
        showToast(`Redirect to home page in ${sec}`);
        sec--;
      } else {
        clearInterval(reloadTime);
        window.location.reload();
      }
    }, 1000);
  }
});

function chatEvent(roomId) {
  document.querySelector(".chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("chat message", {
      message: e.target.message.value,
      room: roomId,
      sender: id,
    });
    e.target.message.value = ""
  });
}

socket.on("chat message", (data) => {
  const messageList = document.querySelector(".chat-messages");
  if (data.sender == id) {
    messageList.innerHTML += `<div class="message user"><span class="label"></span>${data.message}</div>`;
  } else {
    messageList.innerHTML += `<div class="message bot"><span class="label"></span>${data.message}</div>`;
  }
});
