import e from "express";
import controller from "./controller.js";

const router = e.Router();

router.get("/", controller.homePage);
router.get("/authentication", controller.authentication);

export default router;
