import User from "../models/user.js";

export default function (io, sessionMiddleware) {
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.use(async (socket, next) => {
    const req = socket.request;
    if (req.session && req.session.userId) {
      try {
        const user = await User.findById(req.session.userId);
        if (user) {
          socket.user = user;
          return next();
        }
      } catch (err) {
        return next(new Error("User lookup failed"));
      }
    }
    next(new Error("Authentication error"));
  });
}
