import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import debug from "debug";
import path from "path";
import logging from "./start/logging.js";
import config from "./start/config.js";
import router from "./routes/index.js";

const app = e();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
export const log = debug("app:main");
export const __dirname = path.resolve();

logging();
config(app, e);

app.use("/", router);

io.on("connection", (socket) => {
  log("user connected");
});

server.listen(port, () => log(`app running on port ${port}`));
