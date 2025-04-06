import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import debug from "debug";
import path from "path";
import config from "./start/config.js";
import logging from "./start/logging.js";
import db from "./start/db.js";
import router from "./routes/index.js";

const app = e();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
export const log = debug("app:main");
export const __dirname = path.resolve();

config(e, app);
logging();
db();

app.use("/", router);

io.on("connection", (socket) => {
  log("user connected");
  socket.on("disconnect", () => {
    log("user disconnected");
  });
});


server.listen(port, () => log(`server running on port ${port}`));
