import helmet from "helmet";
import path from "path";
import { __dirname } from "../server.js";

export default function (app, express) {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "client/public/templates"));
  app.use(express.static("client"));
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
}
