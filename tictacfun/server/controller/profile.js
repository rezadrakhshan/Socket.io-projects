import _ from "lodash";
import User from "../models/user.js";
import { __dirname } from "../server.js";
import bcrypt from "bcrypt";
import user from "../middleware/user.js";

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
  async changePassword(req, res) {
    const data = _.pick(req.body, ["currentPassword", "newPassword"]);
    const user = await User.findById(req.user.id);
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    req.user = user;
    return res.status(200).json({
      message: "Password was change",
    });
  }
  async saveSettings(req, res) {
    const { language } = req.body;

    if (language) {
      res.cookie("i18next", language);
    }


    res.redirect("/profile");
  }
})();
