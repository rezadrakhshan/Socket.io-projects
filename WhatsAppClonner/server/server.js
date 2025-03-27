import e from "express";
import { createServer } from "http";
import debug from "debug";
import path from "path";
import { Server } from "socket.io";
import config from "./start/config.js";
import logging from "./start/logging.js";
import db from "./start/db.js";
import chat from "./socketHandlers/chat.js";
import router from "./api/index.js";

const port = process.env.PORT || 3000;
const app = e();
const server = createServer(app);
const io = new Server(server);
const log = debug("app:server");
export const __dirname = path.resolve();

config(e, app);
logging();
db()

app.use("/", router);

io.on("connection", (socket) => {
  log("a user connected");
  chat(io, socket);
  socket.on("disconnect", () => {
    log("user disconnected");
  });
});

server.listen(port, () => log(`server running on port ${port}`));
