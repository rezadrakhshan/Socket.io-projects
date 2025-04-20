import e from "express";
import profile from "../controller/profile.js";

const router = e.Router();

router.post("/update", profile.updateProfile);


export default router