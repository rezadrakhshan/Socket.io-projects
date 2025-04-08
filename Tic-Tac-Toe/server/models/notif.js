import mongoose from "mongoose";
import timestampsPlugin from "mongoose-timestamp";

const notifSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

notifSchema.plugin(timestampsPlugin);

const Notification = mongoose.model("Notification", notifSchema);

export default Notification;
