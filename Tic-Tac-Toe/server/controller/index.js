import { __dirname, onlineUsers } from "../server.js";
import Invite from "../models/invite.js";
import Notification from "../models/notif.js";
import User from "../models/user.js";

export default new (class {
  async homePage(req, res) {
    const invites = await Invite.find({ receiver: req.user.id }).populate(
      "sender"
    );
    const notifs = await Notification.find({ user: req.user.id });
    const friends = await User.find({ _id: { $in: req.user.friends } });

    const onlineFriends = friends.filter((f) =>
      onlineUsers.has(f._id.toString())
    );
    const offlineFriends = friends.filter(
      (f) => !onlineUsers.has(f._id.toString())
    );
    res.render("index", {
      user: req.user,
      invites: invites,
      notif: notifs,
      onlineFriends,
      offlineFriends,
    });
  }
  async playWithBot(req, res) {
    res.render("play-with-bot", { user: req.user });
  }
  async profile(req, res) {
    const invites = await Invite.find({ receiver: req.user.id }).populate(
      "sender"
    );
    const notifs = await Notification.find({ user: req.user.id });
    res.render("profile", { user: req.user, invites: invites, notif: notifs });
  }
})();
