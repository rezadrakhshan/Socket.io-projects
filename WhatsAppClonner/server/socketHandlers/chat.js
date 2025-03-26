export default function (io, socket) {
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });
}
