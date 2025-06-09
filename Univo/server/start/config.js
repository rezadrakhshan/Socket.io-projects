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
        ],
      },
    })
  );
  app.use(e.urlencoded({ extended: true }));
  app.use(e.json());
  app.use(e.static("client"));
}
