import e from "express";
import mainRouter from "./routes/main/index.js";

const router = e.Router();

router.use("/", mainRouter);

export default router;
