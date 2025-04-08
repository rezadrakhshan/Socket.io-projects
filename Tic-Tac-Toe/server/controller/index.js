import { __dirname } from "../server.js";
import Invite from "../models/invite.js";

export default new (class {
  async homePage(req, res) {
    const invites = await Invite.find({ receiver: req.user.id }).populate(
      "receiver"
    );
    res.render("index", { user: req.user, invites: invites });
  }
})();
