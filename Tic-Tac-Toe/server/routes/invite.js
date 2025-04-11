import e from "express";
import controller from "../controller/invite.js";

const router = e.Router();

router.get("/users", controller.getAllUser);
router.post("/invite/:id", controller.createInvite);
router.delete("/reject-invite/:id", controller.rejectInvite);
router.delete("/accept-invite/:id", controller.acceptInvite );

export default router;
