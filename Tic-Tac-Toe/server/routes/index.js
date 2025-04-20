import e from "express";
import controller from "../controller/index.js";
import inviteRouter from "./invite.js";
import profileRouter from "./profile.js"

const router = e.Router();

router.get("/", controller.homePage);
router.get("/play-with-bot", controller.playWithBot);
router.use("/api", inviteRouter);
router.use("/api", profileRouter);

export default router;
