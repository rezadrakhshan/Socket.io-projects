import e from "express";
import controller from "../controller/index.js";

const router = e.Router();

router.get("/", controller.homePage);

export default router;
