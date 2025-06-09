import { Router } from "express";
import controller from "../controller/auth.js";

const router = Router();

router.get("/", controller.auth);

export default router;
