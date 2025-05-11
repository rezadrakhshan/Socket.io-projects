import User from "../models/user.js";
import { generateUsername } from "unique-username-generator";

const SKIP_PATHS = [
  "/auth/google",
  "/auth/google/callback"
];

export default async function (req, res, next) {
  try {
    if (req.user) {
      req.session.userId = req.user.id;
      return next();
    }

    if (req.session.userId) {
      req.user = await User.findById(req.session.userId).populate("friends");
      return next();
    }

    if (SKIP_PATHS.includes(req.path)) {
      return next();
    }

    const username = generateUsername("-", 0, 6);
    const user = new User({ username });
    await user.save();

    req.session.userId = user.id;
    req.user = user;

    next();
  } catch (err) {
    console.error("Error in user middleware:", err);
    next();
  }
}
