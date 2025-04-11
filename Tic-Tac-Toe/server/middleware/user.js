import jwt from "jsonwebtoken";
import c from "config";
import User from "../models/user.js";
import { generateUsername } from "unique-username-generator";

export default async function (req, res, next) {
  if (req.cookies.token) {
    const decoded = jwt.verify(req.cookies.token, c.get("jwt_key"));
    req.user = await User.findById(decoded._id).populate("friends");
    next();
  } else {
    const username = generateUsername("-", 0, 6);
    const user = new User({ username: username });
    await user.save();
    const token = jwt.sign({ _id: user.id }, c.get("jwt_key"));
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date("2099-12-31"),
      secure: process.env.NODE_ENV === "production",
    });
    req.user = user;
    next();
  }
}
