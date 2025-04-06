import mongoose from "mongoose";
import {log} from "../server.js";
import c from "config";
import winston from "winston";

export default function () {
  mongoose
    .connect(c.get("db.address"))
    .then(() => {
      log("app connected to mongodb");
    })
    .catch((err) => {
      winston.error(err.message, err);
      log(err);
    });
}
