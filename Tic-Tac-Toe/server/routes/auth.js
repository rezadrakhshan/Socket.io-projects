import { Router } from "express";
import passport from "../middleware/passport.js";

const router = Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err || !user) {
      console.error("Google link error:", err || "No user");
      return res.redirect("/profile");
    }
    req.login(req.user, (err) => {
      if (err) {
        console.error("Login after Google link failed:", err);
        return res.redirect("/profile");
      }
      res.redirect("/profile");
    });
  })(req, res, next);
});


export default router