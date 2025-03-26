import { validationResult } from "express-validator";
import autoBind from "auto-bind";

export default class name {
  constructor() {
    autoBind(this);
  }
  validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const message = [];
      errors.forEach((i) => message.push(errors.message));
      res.status(400).json({
        message: "validation error",
        data: message,
      });
      return false;
    }
    return true;
  }
  validate(req, res, next) {
    if (!this.validationBody(req, res)) {
      return;
    }
    next();
  }
  response({ res, message, data = {}, code = 200 }) {
    res.status(code).json({
      message,
      data,
    });
  }
}
