import friend from "../controller/friend.js";

export default function (socket, onlineUsers, io) {
  socket.on("remove friend", async ({ friendID }) => {
    const result = await friend.removeFriend(socket.user.id, friendID);
    const userTarget = onlineUsers.get(friendID);
    if (userTarget) {
      io.to(userTarget).emit("delete friend", [socket.user.id]);
    }
  });
}
