import mongoose from "mongoose";
import timestampsPlugin from "mongoose-timestamp";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profile: { type: String, default: "/public/image/default.png" },
  friends: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  settings: {
    gameValue: { type: Number, default: 1 },
    language: { type: String, default: "en" },
    ESE: { type: Boolean, default: true },
    backgroundMusic: { type: Boolean, default: true },
    theme: { type: String, default: "light" },
    showAvatar: { type: Boolean, default: true },
    animationSpeed: { type: String, default: "Normal" },
  },
  googleId: { type: String, unique: true, sparse: true },
  password: { type: String, required: false },
});

userSchema.plugin(timestampsPlugin);

const User = mongoose.model("User", userSchema);

export default User;
