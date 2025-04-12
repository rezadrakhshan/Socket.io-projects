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
    if (req.user.friends.includes(req.params.id)) {
      return res.status(401).json("This user must be a friend");
    }
    const invite = new Invite({
      receiver: req.params.id,
      sender: req.user.id,
    });
    await invite.save();
    return res.status(200).json(invite);
  }
  async rejectInvite(req, res) {
    try {
      const invite = await Invite.findByIdAndDelete(req.params.id, {
        new: true,
      }).populate("receiver");
      return res.json(invite);
    } catch (error) {
      console.log(error);
    }
  }
  async acceptInvite(req, res) {
    try {
      const invite = await Invite.findByIdAndDelete(req.params.id, {
        new: true,
      }).populate("receiver").populate("sender");
      const user = await User.findById(req.user.id);
      const sender = await User.findById(invite.sender);
      user.friends.push(invite.sender);
      await user.save();
      sender.friends.push(req.user.id);
      await sender.save();
      return res.json(invite);
    } catch (error) {
      console.log(error);
    }
  }
})();
