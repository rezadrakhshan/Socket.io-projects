import helmet from "helmet";

export default function (e, app) {
  app.use(helmet());
  app.use(e.json());
  app.use(e.static("client"));
  app.use(e.urlencoded({ extended: true }));
}
