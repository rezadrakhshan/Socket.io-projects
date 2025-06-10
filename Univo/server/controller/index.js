import Room from "../models/room.js";
import mongoose from "mongoose";

export default new (class {
  async home(req, res) {
    res.render("index");
  }
  async about(req, res) {
    res.render("about");
  }
  async joinRoom(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.render("404")
    }
    const target = await Room.findById(req.params.id);
    if (!target) {
      return res.render("404")
    }
    res.render("room");
  }
  async createRoom(req, res) {
    const newRoom = await new Room({ users: [req.session.userID] });
    await newRoom.save();
    return res.json(newRoom);
  }
})();
