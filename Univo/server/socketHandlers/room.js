import Room from "../models/room.js";

export default function (socket, io) {
  socket.on("new user", async ({ roomID, userID }) => {
    socket.userID = userID;

    const roomInfo = await Room.findById(roomID);
    if (!roomInfo) return;

    const isHere = roomInfo.users.find((id) => id === userID);
    if (!isHere) {
      roomInfo.users.push(userID);
      await roomInfo.save();
    }

    socket.join(roomID);
    io.to(roomID).emit("user connected", roomInfo.users);
  });

  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];

    for (const room of rooms) {
      if (room === socket.id) continue;

      const target = await Room.findById(room);
      if (!target) continue;

      target.users = target.users.filter((id) => id !== socket.userID);
      await target.save();

      socket.to(room).emit("user disconnected", target.users);
    }
  });
}
