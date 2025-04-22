export default function (socket, onlineUsers, io, games) {
  socket.on("create room", (owner) => {
    const roomId = Math.floor(Math.random() * 10000);
    socket.join(roomId);
    games.set(roomId, {
      users: [
        {
          id: socket.id,
          flag: "",
          isReady: false,
          isOwner: owner == socket.id,
        },
      ],
      isStarted: false,
    });
    socket.emit("create room", {
      roomID: roomId,
      owner: owner,
      users: games.get(roomId).users,
    });
  });
  socket.on("choose flag", ({ id, code, room }) => {
    const game = games.get(parseInt(room));
    const user = game.users.find((user) => user.id == id);
    if (user) {
      user.flag = code;
      io.to(parseInt(room)).emit("update users", game.users);
    }
  });
}
