import { socket } from "../service/room.js";

const usernameInput = document.querySelector("#username");
const joinRoomBtn = document.querySelector("#joinRoom");
const createRoomBtn = document.querySelector("#createRoom");
const mainContainer = document.querySelector("#mainContainer");
const closeModalBtn = document.querySelector(".close-modal")

joinRoomBtn.addEventListener("click", () => {
  joinRoomModal.style.display = "block";
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
  const username = usernameInput.value.trim();
  roomContainer.style.display = "grid";
  mainContainer.remove();
  socket.emit("create room")
});
