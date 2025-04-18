import invite from "../controller/invite.js";

function getUserFromGameData(data, userID) {
  const id1 = data.playerOne._doc._id.toString();
  const id2 = data.playerTwo._doc._id.toString();

  if (id1 === userID) return data.playerOne;
  if (id2 === userID) return data.playerTwo;
  return null;
}

export default function (socket, onlineUsers, io, games) {
  socket.on("request accept", async ({ userID }) => {
    let userTarget = onlineUsers.get(userID);
    let user = onlineUsers.get(socket.user.id);
    const roomId = "game-" + socket.user.id + "-" + userID;
    socket.join(roomId);
    const targetSocket = io.sockets.sockets.get(userTarget);
    if (!targetSocket) {
      console.log("socket not found");
    }
    userTarget = await invite.getUserInfo(userID);
    targetSocket.join(roomId);
    const data = {
      playerOne: { ...socket.user, symbol: "X" },
      playerTwo: { ...userTarget, symbol: "O" },
      roomID: roomId,
      currentTurn: "X",
    };
    games.set(roomId, data);
    io.to(roomId).emit("game start", data);
  });
  socket.on("player move", ({ index, roomID }) => {
    const data = games.get(roomID);
    const user = getUserFromGameData(data, socket.user.id);
    if (user.symbol == data.currentTurn) {
      io.to(roomID).emit("player move", { index: index, symbol: user.symbol });
      if (data.currentTurn == "X") {
        data.currentTurn = "O";
      } else {
        data.currentTurn = "X";
      }
    }
  });
}
