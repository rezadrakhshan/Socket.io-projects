import { __dirname } from "../server.js";
import Invite from "../models/invite.js";
import Notification from "../models/notif.js";

export default new (class {
  async homePage(req, res) {
    const invites = await Invite.find({ receiver: req.user.id }).populate(
      "sender"
    );
    const notifs = await Notification.find({ user: req.user.id });
    res.render("index", {
      user: req.user,
      invites: invites,
      notif: notifs,
      friends: req.user.friends,
    });
  }
  async playWithBot(req, res) {
    res.render("play-with-bot",{user:req.user});
  }
})();
