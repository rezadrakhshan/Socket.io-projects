import mongoose from "mongoose";
import timestampsPlugin from "mongoose-timestamp";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(timestampsPlugin);

const User = mongoose.model("User", userSchema);

export default User;
