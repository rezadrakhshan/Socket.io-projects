import Notification from "../models/notif.js";
import mongoose from "mongoose";

export default new (class {
  async createNotif(message, receiver) {
    const receiverId = new mongoose.Types.ObjectId(receiver);
    const notif = await new Notification({ user: receiverId, text: message });
    await notif.save();
  }
})();
