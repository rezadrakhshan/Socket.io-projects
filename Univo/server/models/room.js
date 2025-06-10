import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    users: { type: [String] },
  },
  { timestamps: true }
);

roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 14400 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
