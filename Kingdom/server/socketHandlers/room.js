export default function (socket, onlineUsers, io, games) {
  let votes = [];
  socket.on("create room", (owner) => {
    const roomId = Math.floor(Math.random() * 10000);
    socket.join(roomId);
    games.set(roomId, {
      users: [
        {
          id: socket.id,
          flag: "",
          isReady: false,
          amount: 100,
        },
      ],
      isStarted: false,
      privateChats: [],
      votes: [],
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
      amount: 100,
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
    game.privateChats = [];
    for (let i = 0; i < game.users.length; i++) {
      for (let j = i + 1; j < game.users.length; j++) {
        game.privateChats.push({
          id: `${game.users[i].id}-${game.users[j].id}`,
          user1: game.users[i].id,
          user2: game.users[j].id,
          messages: [],
        });
      }
    }
    io.to(data).emit("game start", game);
  });
  socket.on("public message", ({ message, id, room }) => {
    const game = games.get(room);
    const user = game.users.find((user) => user.id == id);
    io.to(room).emit("public message", { message: message, user: user });
  });
  socket.on("private message", ({ message, chatId, senderId, room }) => {
    const game = games.get(room);
    const chat = game.privateChats.find((chat) => chat.id === chatId);
    if (chat) {
      const sender = game.users.find((user) => user.id === senderId);
      const messageObj = {
        sender: sender,
        message: message,
        timestamp: new Date(),
      };
      chat.messages.push(messageObj);
      io.to(room).emit("private message", { chatId, message: messageObj });
    }
  });
  socket.on("new vote", ({ vote, room }) => {
    const game = games.get(room);
    game.votes.push(vote);
  });
  socket.on("vote result", (room) => {
    const game = games.get(room);
    const countMap = {};
    for (const id of game.votes) {
      countMap[id] = (countMap[id] || 0) + 1;
    }

    let mostFrequentId = null;
    let maxCount = 0;
    for (const id in countMap) {
      if (countMap[id] > maxCount) {
        mostFrequentId = id;
        maxCount = countMap[id];
      }
    }

    game.users = game.users.filter((user) => user.id !== mostFrequentId);

    const targetSocket = io.sockets.sockets.get(mostFrequentId);
    if (targetSocket) {
      targetSocket.leave(room);
      targetSocket.emit("lose");
    }
    io.to(room).emit("vote result", game.users);
  });
  socket.on("new contract", ({ id, detail }) => {
    const targetUser = io.sockets.sockets.get(id);
    targetUser.emit("receive contract", detail);
  });
}
