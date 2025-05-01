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
          amount: 100,
          haveContract: false,
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
    room = parseInt(room);
    const game = games.get(room);
    const user = game?.users.find((user) => user.id == id);
    if (user) {
      user.flag = code;
      io.to(room).emit("update users", game.users);
    }
  });

  socket.on("join room", (room) => {
    room = parseInt(room);
    const game = games.get(room);
    if (!game) return;

    socket.join(room);

    const alreadyInRoom = game.users.some((user) => user.id === socket.id);
    if (!alreadyInRoom) {
      game.users.push({
        id: socket.id,
        flag: "",
        isReady: false,
        amount: 100,
        haveContract: false,
      });
    }

    socket.emit("room find", { roomID: room });
    io.to(room).emit("new user", game.users);
  });

  socket.on("ready", ({ id, room }) => {
    room = parseInt(room);
    const game = games.get(room);
    const user = game?.users.find((user) => user.id == id);
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

  socket.on("game start", (room) => {
    room = parseInt(room);
    const game = games.get(room);
    if (!game) return;

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
    io.to(room).emit("game start", game);
  });

  socket.on("public message", ({ message, id, room }) => {
    room = parseInt(room);
    const game = games.get(room);
    const user = game?.users.find((user) => user.id == id);
    if (user) {
      io.to(room).emit("public message", { message: message, user: user });
    }
  });

  socket.on("private message", ({ message, chatId, senderId, room }) => {
    room = parseInt(room);
    const game = games.get(room);
    const chat = game?.privateChats.find((chat) => chat.id === chatId);
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
    room = parseInt(room);
    const game = games.get(room);
    if (game) {
      game.votes.push(vote);
    }
  });

  socket.on("vote result", (room) => {
    room = parseInt(room);
    const game = games.get(room);
    if (!game) return;

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

    const votedOutSocket = io.sockets.sockets.get(mostFrequentId);
    if (votedOutSocket) {
      votedOutSocket.leave(room);
      votedOutSocket.emit("lose");
    }

    if (game.users.length === 2) {
      const [user1, user2] = game.users;
      const winner =
        user1.amount > user2.amount
          ? user1
          : user2.amount > user1.amount
          ? user2
          : null;

      if (winner) {
        const winnerSocket = io.sockets.sockets.get(winner.id);
        if (winnerSocket) winnerSocket.emit("win");

        io.to(room).emit("game over", {
          winnerId: winner.id,
          users: game.users,
        });
      } else {
        io.to(room).emit("game draw", game.users);
      }

      game.users.forEach((user) => {
        const userSocket = io.sockets.sockets.get(user.id);
        if (userSocket) userSocket.leave(room);
      });

      games.delete(room);
    } else {
      io.to(room).emit("vote result", game.users);
    }

    game.votes = [];
  });

  socket.on("new contract", ({ id, detail, room }) => {
    room = parseInt(room);
    const game = games.get(room);
    const target = game?.users.find((user) => user.id == id);
    if (!target) return;

    if (target.haveContract) {
      io.to(socket.id).emit("user have contract");
      return;
    }

    target.haveContract = true;

    const targetUser = io.sockets.sockets.get(id);
    if (targetUser) {
      targetUser.emit("receive contract", { detail: detail, room: room });
    }
  });

  socket.on("contract accept", ({ detail, room }) => {
    room = parseInt(room);
    const game = games.get(room);
    const me = game?.users.find((user) => user.id == socket.id);
    const sender = game?.users.find((user) => user.id == detail.sender.id);
    if (!me || !sender) return;

    me.amount += Number(detail.amount);
    sender.amount -= Number(detail.amount);

    const senderSocket = io.sockets.sockets.get(sender.id);
    if (senderSocket) {
      senderSocket.emit("target accept contract");
    }
  });
}
