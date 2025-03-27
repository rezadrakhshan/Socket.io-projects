import parentController from "../../controller.js";
import { __dirname } from "../../../server.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import c from "config"

export default new (class extends parentController {
  async login(req, res) {}
  async register(req, res) {
    try {
      const data = _.pick(req.body, ["email", "password", "username"]);

      let user = await this.User.findOne({ email: data.email });
      if (user) {
        return this.response({
          res,
          message: "Email is already registered",
          code: 400,
        });
      }

      user = await this.User.findOne({ username: data.username });
      if (user) {
        return this.response({
          res,
          message: "Username is already taken",
          code: 400,
        });
      }

      user = new this.User(data);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      const token = jwt.sign({ _id: user.id }, c.get("jwt_key"));

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      return this.response({
        res,
        message: "Registration successful! Welcome to our platform",
        data: token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return this.response({
        res,
        message: "Error in registration. Please try again",
        code: 500,
      });
    }
  }
})();
