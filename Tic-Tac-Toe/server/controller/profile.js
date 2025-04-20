import User from "../models/user.js";
import _ from "lodash";

export default new (class {
  async updateProfile(req, res) {
    const data = _.pick(req.body, ["username", "profile", "password"]);
    const user = await User.findByIdAndUpdate(req.user.id, data, { new: true });
    return res.json(user);
  }
})();
