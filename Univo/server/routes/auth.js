import { Router } from "express";
import controller from "../controller/auth.js";

const router = Router();

router.get("/", controller.auth);
router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
