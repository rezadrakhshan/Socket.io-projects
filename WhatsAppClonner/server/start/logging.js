import winston from "winston";
import debug from "debug";

const log = debug("app:server");

export default function () {
  winston.add(new winston.transports.File({ filename: "errors.log" }));

  process.on("uncaughtException", (ex) => {
    log(ex);
    winston.error(ex.message, ex);
  });
  process.on("unhandledRejection", (ex) => {
    log(ex);
    winston.error(ex.message, ex);
  });
}
