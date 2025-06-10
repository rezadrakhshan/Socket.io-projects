import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import debug from "debug";
import path from "path";
import c from "config";
import session from "express-session";
import MongoStore from "connect-mongo";
import logging from "./start/logging.js";
import config from "./start/config.js";
import db from "./start/db.js";
import router from "./routes/index.js";
import user from "./middleware/user.js";
import NotFoundMiddleware from "./middleware/404.js"

const app = e();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
export const log = debug("app:main");
export const __dirname = path.resolve();

const sessionMiddleware = session({
  secret: "sajkdgkjadgfkjadfgjdkaad",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: c.get("db.address"),
    collectionName: "sessions",
    touchAfter: 60 * 60 * 1,
  }),
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

logging();
config(app, e);
db();

app.use(user)
app.use("/", router);
app.use(NotFoundMiddleware)

io.on("connection", (socket) => {
  log("user connected");
});

server.listen(port, () => log(`app running on port ${port}`));
