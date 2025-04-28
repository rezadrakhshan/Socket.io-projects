import _ from "lodash";
import User from "../models/user.js";
import { __dirname } from "../server.js";
import bcrypt from "bcrypt";

export default new (class {
  async updateAvatar(req, res) {
    try {
      const data = _.pick(req.body, ["username", "password"]);
  
      if (req.file) {
        data.profile = req.file.path;
      }
  
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
  
      const result = await User.findByIdAndUpdate(req.user.id, data, {
        new: true,
      });
  
      return res.json(result);
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.username) {
        return res.status(400).json({ message: "Username already exists." });
      }
      return res.status(500).json({ message: error.message });
    }
  }
  
})();
