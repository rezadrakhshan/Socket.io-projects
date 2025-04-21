export default function (socket, onlineUsers, io, games) {
  socket.on("create room", () => {
    const roomId = Math.floor(Math.random() * 10000);
    socket.join(roomId);
    games.set(roomId, {
      users: [socket.id],
      isStarted: false,
    });
    socket.emit("create room", roomId);
  });
}
