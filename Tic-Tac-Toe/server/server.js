import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import debug from "debug";
import path from "path";
import config from "./start/config.js";
import logging from "./start/logging.js";
import db from "./start/db.js";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import c from "config";
import router from "./routes/index.js";
import authRoutes from "./routes/auth.js"
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


app.use(session({
  store: MongoStore.create({
    mongoUrl:c.get("db.address"), 
    collectionName: "sessions",
  }),
  secret: c.get("session-secret"),
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(userMiddle);
app.use('/auth', authRoutes);
app.use("/", router);


export const onlineUsers = new Map();
const games = new Map();

authentication(io);

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
