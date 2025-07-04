import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import debug from "debug";
import path from "path";
import { setupI18n } from "./start/i18n.js";
import config from "./start/config.js";
import logging from "./start/logging.js";
import db from "./start/db.js";
import passport from "passport";
import router from "./routes/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import c from "config";
import authRoutes from "./routes/auth.js";
import userMiddle from "./middleware/user.js";
import authentication from "./socketHandlers/authentication.js";
import friend from "./socketHandlers/friend.js";
import invite from "./socketHandlers/invite.js";
import game from "./socketHandlers/game.js";

const app = e();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
export const log = debug("app:main");
export const __dirname = path.resolve();

config(e, app);
logging();
db();

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
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
  },
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

const i18nMiddleware = await setupI18n();
app.use(i18nMiddleware);

app.use((req, res, next) => {
  res.locals.t = req.t;
  res.locals.language = req.language;
  res.locals.languageDir = req.i18n.dir();
  next();
});

app.use(userMiddle);

app.use("/auth", authRoutes);
app.use("/", router);


export const onlineUsers = new Map();
const games = new Map();

authentication(io, sessionMiddleware);

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  friend(socket, onlineUsers, io);
  invite(socket, onlineUsers, io);
  game(socket, onlineUsers, io, games);

  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

server.listen(port, () => log(`server running on port ${port}`));
