import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import {__dirname} from "../server.js";

export default function (e, app) {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "client/public/templates"));
  app.use(cookieParser());
  app.use(helmet());
  app.use(e.json());
  app.use(e.static("client"));
  app.use(e.urlencoded({ extended: true }));
}
