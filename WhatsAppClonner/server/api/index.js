import e from "express";
import mainRouter from "./routes/main/index.js";
import authRouter from "./routes/auth/index.js"

const router = e.Router();

router.use("/", mainRouter);
router.use("/auth", authRouter);

export default router;
