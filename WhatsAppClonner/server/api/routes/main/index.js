import e from "express";
import controller from "./controller.js";
import isLoggedIn from "../../../middleware/auth.js";

const router = e.Router();

router.get("/", isLoggedIn, controller.homePage);
router.get("/authentication", controller.authentication);

export default router;
