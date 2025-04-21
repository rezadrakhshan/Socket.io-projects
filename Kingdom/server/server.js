import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import debug from "debug";
import config from "./start/config.js";
import logging from "./start/logging.js";
import router from "./router/index.js";

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
export const log = debug("app:main");
export const __dirname = path.resolve();

config(app, express);
logging();

app.use("/", router);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userID) => {
    onlineUsers.set(userID, socket.id);
  });
});

server.listen(port, () => log(`server running on port ${port}`));
