import User from "../models/user.js";
import jwt from "jsonwebtoken";
import c from "config";


export default function (io) {
  io.use(async (socket, next) => {
    const token = socket.handshake.headers.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      jwt.verify(token, c.get("jwt_key"), async (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.user = await User.findById(decoded._id);
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });
}
