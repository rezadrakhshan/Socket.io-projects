import { Router } from "express";
import controller from "../controller/auth.js";

const router = Router();

router.get("/", controller.auth);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

export default router;
