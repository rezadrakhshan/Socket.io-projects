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
          privateChats: [],
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
  socket.on("join room", (room) => {
    const game = games.get(parseInt(room));
    if (!game) {
      return;
    }
    socket.join(parseInt(room));
    game.users.push({
      id: socket.id,
      flag: "",
      isReady: false,
      privateChats: [],
    });
    socket.emit("room find", { roomID: room });
    io.to(parseInt(room)).emit("new user", game.users);
  });
  socket.on("ready", ({ id, room }) => {
    const game = games.get(room);
    const user = game.users.find((user) => user.id == id);
    if (user) {
      user.isReady = !user.isReady;
      const haveNotReady = game.users.find((user) => user.isReady == false);
      if (haveNotReady) {
        io.to(room).emit("ready", { users: game.users });
      } else {
        io.to(room).emit("ready", { users: game.users, starting: true });
      }
    }
  });
  socket.on("game start", (data) => {
    const game = games.get(data);
    io.to(data).emit("game start");
  });
  socket.on("public message", ({ message, id, room }) => {
    const game = games.get(room);
    const user = game.users.find((user) => user.id == id);
    io.to(room).emit("public message", { message: message, user: user });
  });
  socket.on("private chat", ({ otherUserID, room }) => {
    const game = games.get(room);
    const target = game.users.find((user) => user.id == otherUserID);
    console.log(game.users)
    console.log(otherUserID)
    console.log(target)
    if (!target.privateChats.find((chat) => chat.otherUserId == otherUserID)) {
      target.privateChats.push({
        otherUserId: otherUserID,
        chatHistory: [],
      });
    }
    io.to(socket.id).to(otherUserID).emit("private chat", target);
  });
}
