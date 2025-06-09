import _ from "lodash";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import c from "config";

export default new (class {
  async auth(req, res) {
    res.render("auth");
  }
  async register(req, res) {
    const data = _.pick(req.body, ["fullname", "email", "password"]);
    let user = await User.findOne({ email: data.email });
    if (user) {
      return res.status(400).json({
        msg: "email taken",
      });
    }
    const saltRound = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, saltRound);
    user = await new User(data);
    await user.save();
    const payload = { id: user.id };
    return res.json({
      msg: "user created",
      token: jwt.sign(payload, c.get("jwt_secret")),
    });
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
    const payload = { id: user.id };
    return res.json({
      msg: "login successfuly",
      token: jwt.sign(payload, c.get("jwt_secret")),
    });
  }
})();
