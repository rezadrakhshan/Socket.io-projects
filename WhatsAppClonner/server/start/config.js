import helmet from "helmet";

export default function (e, app) {
  app.use(e.json());
  app.use(helmet());
  app.use(e.urlencoded({ extended: true }));
  app.use(e.static("client"));
}
