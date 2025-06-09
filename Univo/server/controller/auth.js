import _ from "lodash";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export default new (class {
  async auth(req, res) {
    res.render("auth");
  }
  async register(req, res) {
    const data = _.pick(req.body, ["fullname", "email", "password"]);
    let user = await User.findOne({ email: data.email });
    if (user) {
      return res.status(400).json({
        msg: "Email taken",
      });
    }
    const saltRound = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, saltRound);
    user = await new User(data);
    await user.save();
    req.session.userID = user.id;
    return res.status(200).json({ msg: "welcome" });
  }
  async login(req, res) {
    const data = _.pick(req.body, ["email", "password"]);
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    req.session.userID = user.id;
    return res.status(200).json({ msg: "welcome" });
  }
  async logout(req, res) {
    req.session.destroy();
    res.status(200).json({ message: "logged out" });
  }
})();
