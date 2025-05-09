import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import c from "config";
import User from "../models/user.js"; // برای پیدا کردن و بروزرسانی کاربر موجود

const GOOGLE_CLIENT_ID = c.get("google-auth.client-id");
const GOOGLE_CLIENT_SECRET = c.get("google-auth.client-secret");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findById(req.user.id);

        if (existingUser) {
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        done(null, null);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
