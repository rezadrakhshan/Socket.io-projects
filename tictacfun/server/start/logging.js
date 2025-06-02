import winston from "winston";
import { log } from "../server.js";

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
