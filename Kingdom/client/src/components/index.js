import { socket, id, users } from "../service/room.js";

const joinRoomBtn = document.querySelector("#joinRoom");
const createRoomBtn = document.querySelector("#createRoom");
export const mainContainer = document.querySelector("#mainContainer");
const closeModalBtn = document.querySelector(".close-modal");
export const waitingRoom = document.querySelector("#waitingRoom");
const waitingUsersList = document.querySelector("#waitingUsersList");
const waitingReadyBtn = document.querySelector("#waitingReadyBtn");
const countryModal = document.querySelector("#countryModal");
const countriesGrid = document.querySelector("#countriesGrid");
const roomID = document.querySelector("#waitingRoomId");
let round = 1;
let timerStarted = false;
let clickBlocker = null;

const countries = [
  { code: "ir", name: "Iran" },
  { code: "us", name: "America" },
  { code: "gb", name: "England" },
  { code: "de", name: "German" },
  { code: "fr", name: "France" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "ru", name: "Russia" },
  { code: "cn", name: "China" },
  { code: "jp", name: "Japan" },
];

document.querySelectorAll(".close-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    countryModal.style.display = "none";
  });
});

window.addEventListener("click", (event) => {
  if (event.target === countryModal) {
    countryModal.style.display = "none";
  }
});

export function renderCountries(users) {
  countriesGrid.innerHTML = "";
  countries.forEach((country) => {
    const countryElement = document.createElement("div");
    countryElement.className = `country-item ${
      users.some((user) => user.flag == country.code) ? "selected" : ""
    }`;
    countryElement.dataset.code = country.code;

    const flagElement = document.createElement("img");
    flagElement.className = "country-flag";
    flagElement.src = `/public/image/flags/${country.code}.png`;
    flagElement.alt = country.name;

    const nameElement = document.createElement("span");
    nameElement.className = "country-name";
    nameElement.textContent = country.name;

    countryElement.appendChild(flagElement);
    countryElement.appendChild(nameElement);

    countriesGrid.appendChild(countryElement);

    countryElement.addEventListener("click", () => {
      if (!countryElement.classList.contains("selected")) {
        const flagCode = countryElement.getAttribute("data-code");
        const roomID = document.querySelector("#waitingRoomId").innerText;
        socket.emit("choose flag", { id: id, code: flagCode, room: roomID });
      }
    });
  });
}

joinRoomBtn.addEventListener("click", () => {
  joinRoomModal.style.display = "block";
  document.querySelector(".input-group").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = e.target.roomId.value;
    socket.emit("join room", value);
    joinRoomModal.style.display = "none";
  });
});

closeModalBtn.addEventListener("click", () => {
  joinRoomModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === joinRoomModal) {
    joinRoomModal.style.display = "none";
  }
});

createRoomBtn.addEventListener("click", () => {
  waitingRoom.style.display = "flex";
  mainContainer.remove();
  socket.emit("create room", id);
});

waitingReadyBtn.addEventListener("click", () => {
  waitingReadyBtn.classList.toggle("ready");
  socket.emit("ready", { id: id, room: parseInt(roomID.innerText) });
});

export function updateWaitingUsersList(users) {
  waitingUsersList.innerHTML = "";
  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.className = "waiting-user-item";

    const flagElement = document.createElement("img");
    flagElement.className = "waiting-user-flag";
    flagElement.src = `/public/image/flags/${user.flag}.png`;
    flagElement.alt = user.flag;

    const nameElement = document.createElement("span");
    nameElement.className = "waiting-user-name";
    nameElement.textContent = user.id;

    userElement.appendChild(flagElement);
    userElement.appendChild(nameElement);
    if (!user.isOwner) {
      const statusElement = document.createElement("div");
      statusElement.className = `waiting-user-status ${
        user.isReady ? "ready" : ""
      }`;
      userElement.appendChild(statusElement);
    }

    waitingUsersList.appendChild(userElement);
  });
}

export function renderRoomInfo(users, isVote = false) {
  if (isVote) {
    const userList = document.querySelector("#usersList");
    userList.innerHTML = "";
    users.forEach((user) => {
      if (user.id == id) {
        userList.innerHTML += `
        <div class="user-item">
            <div class="country-flag" style="background-image: url('/public/image/flags/${user.flag}.png')"></div>
            <span id="unread-message">0</span>
        </div>
        `;
      } else {
        userList.innerHTML += `
        <div class="user-item">
            <div class="country-flag" style="background-image: url('/public/image/flags/${user.flag}.png')"></div>
            <span id="unread-message">0</span>
            <button class="action-btn" id="vote" data-user-id="${user.id}">Vote</button>
        </div>
        `;
      }
    });
  } else {
    const userList = document.querySelector("#usersList");
    userList.innerHTML = "";
    users.forEach((user) => {
      if (user.id == id) {
        userList.innerHTML += `
        <div class="user-item">
            <div class="country-flag" style="background-image: url('/public/image/flags/${user.flag}.png')"></div>
            <span id="unread-message">0</span>
        </div>
        `;
      } else {
        userList.innerHTML += `
        <div class="user-item">
            <div class="country-flag" style="background-image: url('/public/image/flags/${user.flag}.png')"></div>
            <span id="unread-message">0</span>
            <button class="action-btn msg" data-user-id="${user.id}">Send Message</button>
        </div>
        `;
      }
    });
  }

  document.querySelectorAll(".msg").forEach((button) => {
    button.addEventListener("click", (e) => {
      const userId = e.target.getAttribute("data-user-id");
      const chatContainers = document.querySelectorAll(".private-chat");
      chatContainers.forEach((container) => {
        const chatId = container.getAttribute("data-chat-id");
        if (chatId.includes(userId)) {
          container.style.display = "flex";
          container.style.flexDirection = "column";
          container.style.height = "calc(100vh - 100px)";
          container.style.overflowY = "auto";
        } else {
          container.style.display = "none";
        }
      });
    });
  });
}

export function renderTimer() {
  if (timerStarted) return;
  timerStarted = true;

  const timerSpan = document.querySelector("#timer");
  let time = 60;

  const intervalId = setInterval(() => {
    time--;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    timerSpan.innerHTML = formattedTime;

    if (time <= 0) {
      clearInterval(intervalId);
      document.querySelector("#timeStatus").innerText = "Vote Time";
      voteTimer(timerSpan);
      renderRoomInfo(users, true);
      addVote();
      disableClicks();
    }
  }, 1000);
}

function voteTimer(timerSpan) {
  let time = 30;
  const intervalId = setInterval(() => {
    time--;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    timerSpan.innerHTML = formattedTime;

    if (time <= 0) {
      clearInterval(intervalId);
      socket.emit("vote result", parseInt(roomID.innerText));
      console.log(users)
      enableClicks();
      timerStarted = false;
      round++;
      document.querySelector("#round").innerText = round;
      renderRoomInfo(users,false);
      renderTimer();
    }
  }, 1000);
}

function disableClicks() {
  clickBlocker = function (e) {
    const isActionBtn = e.target.closest("#vote");
    if (!isActionBtn) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  document.body.addEventListener("click", clickBlocker, true);

  const chatOverlay = document.querySelectorAll(
    ".chat-container .chat-overlay"
  );
  chatOverlay.forEach((over) => {
    over.classList.remove("hidden");
  });
}

function enableClicks() {
  if (clickBlocker) {
    document.body.removeEventListener("click", clickBlocker, true);
    clickBlocker = null;
  }

  const chatOverlay = document.querySelectorAll(
    ".chat-overlay"
  );
  chatOverlay.forEach((over) => {
    over.classList.add("hidden");
  });
}

function addVote() {
  const voteBtns = document.querySelectorAll("#vote");
  voteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      socket.emit("new vote", {
        vote: btn.getAttribute("data-user-id"),
        room: parseInt(roomID.innerText),
      });
      document
        .querySelector(".users-list .chat-overlay")
        .classList.remove("hidden");
    });
  });
}

export function submitPublicForm() {
  const oldForm = document.querySelector("#publicForm");
  const newForm = oldForm.cloneNode(true);
  oldForm.parentNode.replaceChild(newForm, oldForm);

  newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("public message", {
      message: e.target.message.value,
      id: id,
      room: parseInt(roomID.innerText),
    });
    newForm.reset();
  });
}

export function renderPublicMessage(data) {
  const messageList = document.querySelector("#publicMessages");
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");

  if (data.user.id == id) {
    newMessage.classList.add("my-message");
  }

  if (data.user.id == id) {
    newMessage.innerHTML = `
      <div class="message-content">
        <div class="message-text">${data.message}</div>
      </div>
      <div class="message-avatar">
        <img src="/public/image/flags/${data.user.flag}.png" alt="${data.user.flag}" class="message-flag">
      </div>
    `;
  } else {
    newMessage.innerHTML = `
      <div class="message-avatar">
        <img src="/public/image/flags/${data.user.flag}.png" alt="${data.user.flag}" class="message-flag">
      </div>
      <div class="message-content">
        <div class="message-text">${data.message}</div>
      </div>
    `;
  }

  messageList.appendChild(newMessage);

  messageList.scrollTop = messageList.scrollHeight;
}

export function renderPrivateChat(data) {
  data.forEach((chat) => {
    if (chat.user1 == id || chat.user2 == id) {
      if (document.querySelector(`[data-chat-id="${chat.id}"]`)) {
        return;
      }
      const chatContainer = document.createElement("div");
      chatContainer.className = "private-chat";
      chatContainer.style.display = "none";
      chatContainer.dataset.chatId = chat.id;

      chatContainer.innerHTML = `
        <h3 class="chat-header" id="private-header">Private Chat</h3>
        <div class="messages" id="privateMessages-${chat.id}">
        </div>
        <form class="message-input" id="privateForm-${chat.id}">
          <input
            type="text"
            id="privateMessageInput-${chat.id}"
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      `;

      document.querySelector(".chat-container").appendChild(chatContainer);

      const form = chatContainer.querySelector(`#privateForm-${chat.id}`);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = chatContainer.querySelector(
          `#privateMessageInput-${chat.id}`
        );
        const message = input.value;
        if (message.trim()) {
          socket.emit("private message", {
            message: message,
            chatId: chat.id,
            senderId: id,
            room: parseInt(roomID.innerText),
          });
          input.value = "";
        }
      });
    }
  });
}

export function renderPrivateMessage(data) {
  const messagesContainer = document.querySelector(
    `#privateMessages-${data.chatId}`
  );
  if (messagesContainer) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${
      data.message.sender.id === id ? "my-message" : ""
    }`;

    messageElement.innerHTML = `
      <div class="message-avatar">
        <img src="/public/image/flags/${data.message.sender.flag}.png" alt="${data.message.sender.flag}" class="message-flag">
      </div>
      <div class="message-content">
        <div class="message-text">${data.message.message}</div>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
