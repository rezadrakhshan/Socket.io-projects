import {
  updateWaitingUsersList,
  renderCountries,
  mainContainer,
  waitingRoom,
} from "../components/index.js";

const roomID = document.querySelector("#waitingRoomId");
const selectCountryBtn = document.querySelector("#selectCountry");
const readyBtn = document.querySelector(".ready-btn");
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
  if (data.owner == id) {
    readyBtn.remove();
    const startBtn = document.createElement("button");
    startBtn.classList.add("ready-btn");
    startBtn.innerText = "Start";
    document.querySelector(".waiting-controls").appendChild(startBtn);
  }
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
