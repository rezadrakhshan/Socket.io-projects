import e from "express";
import controller from "../controller/index.js";
import inviteRouter from "./invite.js";

const router = e.Router();

router.get("/", controller.homePage);
router.get("/play-with-bot", controller.playWithBot);
router.use("/api", inviteRouter);

export default router;
