import notif from "../controller/notif.js";

export default function (socket, onlineUsers,io) {
  socket.on("invite", ({ toUserId, inviteId, message }) => {
    const targetSocketId = onlineUsers.get(toUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("invite", [message, socket.user, inviteId]);
    }
  });

  socket.on("reject invite", async ({ userId, message }) => {
    const userTarget = onlineUsers.get(userId);
    await notif.createNotif(message, userId);
    if (userTarget) {
      io.to(userTarget).emit("notif", [message, socket.user]);
    }
  });
  socket.on("accept invite", async ({ userId, message }) => {
    const userTarget = onlineUsers.get(userId);
    await notif.createNotif(message, userId);
    if (userTarget) {
      io.to(userTarget).emit("notif", [message, socket.user]);
    }
  });
}
