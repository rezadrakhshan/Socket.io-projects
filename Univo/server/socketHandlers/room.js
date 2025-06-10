import Room from "../models/room.js";

export default function (socket, io) {
  socket.on("new user", async ({ roomID, userID }) => {
    const roomInfo = await Room.findById(roomID);
    const isHere = roomInfo.users.find((id) => id == userID);
    if (!isHere) {
      roomInfo.users.push(userID);
      await roomInfo.save();
    }
    socket.join(roomID);
    io.to(roomID).emit("user connected", roomInfo.users);
  });
}
