import mongoose from "mongoose";
import timestampsPlugin from "mongoose-timestamp";

const inviteSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

inviteSchema.plugin(timestampsPlugin);

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
