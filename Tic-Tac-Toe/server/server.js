import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import debug from "debug";
import path from "path";
import config from "./start/config.js";
import logging from "./start/logging.js";
import db from "./start/db.js";
import router from "./routes/index.js";
import user from "./middleware/user.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import c from "config";
import notif from "./controller/notif.js";
import friend from "./controller/friend.js";

const app = e();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
export const log = debug("app:main");
export const __dirname = path.resolve();

config(e, app);
logging();
db();

app.use("/", user, router);

const onlineUsers = new Map();

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

io.on("connection", (socket) => {
  log("a user connected");

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("invite", ({ toUserId, inviteId, message }) => {
    const targetSocketId = onlineUsers.get(toUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("invite", [message, socket.user, inviteId]);
    }
  });

  socket.on("reject invite", async ({ userId, message }) => {
    const userTarget = onlineUsers.get(userId);
    await notif.createNotif(message, userId);
    if (userTarget) {
      io.to(userTarget).emit("notif", [message, socket.user]);
    }
  });
  socket.on("accept invite", async ({ userId, message }) => {
    const userTarget = onlineUsers.get(userId);
    await notif.createNotif(message, userId);
    if (userTarget) {
      io.to(userTarget).emit("notif", [message, socket.user]);
    }
  });

  socket.on("remove friend", async ({ friendID }) => {
    const userTarget = onlineUsers.get(socket.user.id);
    const result = await friend.removeFriend(socket.user.id, friendID);
  });

  socket.on("disconnect", () => {
    log("user disconnected");
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

server.listen(port, () => log(`server running on port ${port}`));
