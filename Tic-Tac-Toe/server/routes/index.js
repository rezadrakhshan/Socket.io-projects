import e from "express";
import controller from "../controller/index.js";
import user from "../middleware/user.js";

const router = e.Router();

router.get("/", user, controller.homePage);

export default router;
