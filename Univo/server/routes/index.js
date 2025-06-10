import e from "express";
import controller from "../controller/index.js";
import authRouter from "./auth.js";

const router = e.Router();

router.get("/", controller.home);
router.get("/about", controller.about);
router.use("/auth", authRouter);

export default router;
