import helmet from "helmet";
import cookieParser from "cookie-parser";

export default function (e, app) {
  app.use(cookieParser())
  app.use(helmet());
  app.use(e.json());
  app.use(e.static("client"));
  app.use(e.urlencoded({ extended: true }));
}
