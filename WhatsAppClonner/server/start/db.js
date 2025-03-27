import mongoose from "mongoose";
import debug from "debug";
import c from "config";
import winston from "winston";

const log = debug("app:server");

export default function () {
  mongoose
    .connect(c.get("db.address"))
    .then(() => {
      log("Connected to MongoDB successfully");
    })
    .catch((err) => {
      winston.error(err.message, err);
      log("Failed to connect to MongoDB: " + err);
    });
}
