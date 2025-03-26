import e from "express";
import { createServer } from "http";
import debug from "debug";
import path from "path";
import { Server } from "socket.io";
import config from "./start/config.js";
import logging from "./start/logging.js";
import chat from "./socketHandlers/chat.js";

const port = process.env.PORT || 3000;
const app = e();
const server = createServer(app);
const io = new Server(server);
const log = debug("app:server");
const __dirname = path.resolve();

config(e, app);
logging();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/public/templates/index.html"));
});

io.on("connection", (socket) => {
  log("a user connected");
  chat(io, socket);
  socket.on("disconnect", () => {
    log("user disconnected");
  });
});

server.listen(port, () => log(`server running on port ${port}`));
