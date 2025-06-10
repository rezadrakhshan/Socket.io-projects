import { socket, renderRoomUser } from "../components/room.js";

socket.on("user connected", (data) => {
  renderRoomUser(data);
});

socket.on("user disconnected", (data) => {
  renderRoomUser(data);
});
