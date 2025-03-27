import helmet from "helmet";
import cookieParser from "cookie-parser";

export default function (e, app) {
  app.use(e.json());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://cdn.jsdelivr.net",
            "https://unpkg.com",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com",
            "https://unpkg.com",
          ],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "ws:"],
          fontSrc: [
            "'self'",
            "https://cdnjs.cloudflare.com",
            "https://unpkg.com",
          ],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'"],
        },
      },
    })
  );
  app.use(e.urlencoded({ extended: true }));
  app.use(e.static("client"));
  app.use(cookieParser());
}
