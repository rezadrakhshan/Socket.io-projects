import e from "express";
import controller from "./controller.js";
import validator from "./validator.js";

const router = e.Router();
router.get("/login", controller.login);
router.post(
  "/register",
  validator.registerValidator(),
  controller.validate,
  controller.register
);

export default router;
