import e from "express";
import { upload } from "../middleware/upload.js";
import controller from "../controller/profile.js";

const router = e.Router();

router.post("/upload-avatar", upload.single("avatar"), controller.updateAvatar);
router.post("/change-password", controller.changePassword);
router.post("/settings", controller.saveSettings);

export default router;
