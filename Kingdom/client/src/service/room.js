import { updateWaitingUsersList } from "../components/index.js";

const roomID = document.querySelector("#waitingRoomId");
const readyBtn = document.querySelector(".ready-btn");
export let socket = io();
export let id;

socket.on("connect", () => {
  id = socket.id;
  socket.emit("register", id);
});

socket.on("create room", (data) => {
  roomID.innerText = data.roomID;
  if (data.owner == id) {
    readyBtn.remove();
    const startBtn = document.createElement("button");
    startBtn.classList.add("ready-btn");
    startBtn.innerText = "Start";
    document.querySelector(".waiting-controls").appendChild(startBtn);
  }
  updateWaitingUsersList(data.users);
});

socket.on("update users", (users) => {
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
