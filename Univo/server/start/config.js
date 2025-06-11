import helmet from "helmet";
import { __dirname } from "../server.js";
import path from "path";

export default function (app, e) {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "client/public/templates"));
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
        ],
        connectSrc: [
          "'self'",
          "ws://localhost:3000",
          "ws://127.0.0.1:3000",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "https://univo.reza-derakhshan.ir", 
          "wss://univo.reza-derakhshan.ir",
        ],
        mediaSrc: ["'self'", "blob:", "data:"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    })
  );
  app.use(e.urlencoded({ extended: true }));
  app.use(e.json());
  app.use(e.static("client"));
}
