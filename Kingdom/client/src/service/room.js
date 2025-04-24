import {
  updateWaitingUsersList,
  renderCountries,
  mainContainer,
  waitingRoom,
  renderRoomInfo,
  renderPublicMessage,
  submitPublicForm,
  renderPrivateChat,
} from "../components/index.js";

const roomID = document.querySelector("#waitingRoomId");
const selectCountryBtn = document.querySelector("#selectCountry");
const title = document.querySelector("#title");
const roomContainer = document.querySelector("#roomContainer");

export let socket = io();
export let id;
let users;

selectCountryBtn.addEventListener("click", () => {
  countryModal.style.display = "block";
  renderCountries(users);
});

socket.on("connect", () => {
  id = socket.id;
  socket.emit("register", id);
});

socket.on("create room", (data) => {
  roomID.innerText = data.roomID;
  users = data.users;
  updateWaitingUsersList(users);
});

socket.on("update users", (updatedUsers) => {
  users = updatedUsers;
  document.querySelectorAll(".country-item").forEach((item) => {
    item.classList.remove("selected");
  });

  users.forEach((user) => {
    if (user.flag) {
      const selectedCountryElement = document.querySelector(
        `.country-item[data-code="${user.flag}"]`
      );
      if (selectedCountryElement) {
        selectedCountryElement.classList.add("selected");
      }
    }
  });

  updateWaitingUsersList(users);
});

socket.on("new user", (data) => {
  users = data;
  updateWaitingUsersList(users);
});

socket.on("room find", (data) => {
  roomID.innerText = data.roomID;
  waitingRoom.style.display = "flex";
  mainContainer.remove();
});

socket.on("ready", (data) => {
  users = data.users;
  if (data.starting) {
    if (window.gameTimer) {
      clearInterval(window.gameTimer);
    }

    let timer = 5;
    window.gameTimer = setInterval(() => {
      if (timer > 0) {
        title.innerText = `Game starting in ${timer}`;
        timer--;
      } else {
        clearInterval(window.gameTimer);
        window.gameTimer = null;
        socket.emit("game start", parseInt(roomID.innerText));
      }
    }, 1000);
  } else {
    if (window.gameTimer) {
      clearInterval(window.gameTimer);
      window.gameTimer = null;
    }
    title.innerText = "Waiting Room";
  }
  updateWaitingUsersList(users);
});

socket.on("game start", () => {
  waitingRoom.remove();
  roomContainer.style.display = "grid";
  renderRoomInfo(users);
  submitPublicForm();
});

socket.on("public message", (data) => {
  renderPublicMessage(data);
});

socket.on("private chat", (data) => {
  renderPrivateChat(data);
});
