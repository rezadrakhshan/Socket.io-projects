import User from "../models/user.js";
import mongoose from "mongoose";
import Invite from "../models/invite.js";

export default new (class {
  async getAllUser(req, res) {
    const users = await User.find({ _id: { $ne: req.user.id } });
    return res.status(200).json({ message: "All user is here", data: users });
  }
  async createInvite(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(401).json("Invalid ID");
    }
    const searchInDatabse = await Invite.find({
      receiver: req.params.id,
      sender: req.user.id,
    });
    if (searchInDatabse.length > 0) {
      return res.status(401).json("User invited");
    }
    const invite = new Invite({
      receiver: req.params.id,
      sender: req.user.id,
    });
    await invite.save();
    return res.status(200).json("Invite Sent");
  }
})();
