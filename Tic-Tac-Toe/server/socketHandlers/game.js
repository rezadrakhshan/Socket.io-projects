import invite from "../controller/invite.js";

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
    io.to(roomId).emit("game start", {
      playerOne: socket.user,
      playerTwo: userTarget,
    });
    console.log(`game start roomID:${roomId}`);
  });
}
