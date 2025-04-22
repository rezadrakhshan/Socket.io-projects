const roomID = document.querySelector("#currentRoomId");
export let socket = io();
let id;

socket.on("connect", () => {
  id = socket.id;
  socket.emit("register", id);
});

socket.on("create room", (data) => {
  roomID.innerText = data;
});
