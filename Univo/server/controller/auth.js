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
        msg: "email taken",
      });
    }
    const saltRound = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, saltRound);
    user = await new User(data);
    await user.save()
    return res.json({
      msg: "user created",
      data: _.pick(user, ["email", "fullname"]),
    });
  }
})();
