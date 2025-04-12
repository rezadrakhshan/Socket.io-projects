import Notification from "../models/notif.js";
import mongoose from "mongoose";

export default new (class {
  async createNotif(message, receiver) {
    const notif = await new Notification({ user: receiver, text: message });
    await notif.save();
  }
})();
