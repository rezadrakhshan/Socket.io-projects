import mongoose from "mongoose";
import timestampsPlugin from "mongoose-timestamp";

const notifSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
});

notifSchema.plugin(timestampsPlugin);

const Notification = mongoose.model("Notification", notifSchema);

export default Notification;
