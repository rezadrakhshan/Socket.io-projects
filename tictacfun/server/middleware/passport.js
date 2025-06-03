import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import c from "config";
import User from "../models/user.js";

const GOOGLE_CLIENT_ID = c.get("google-auth.client-id");
const GOOGLE_CLIENT_SECRET = c.get("google-auth.client-secret");

const callbackBaseURL =
  process.env.NODE_ENV === "production"
    ? "https://tictacfun.reza-derakhshan.ir"
    : "http://127.0.0.1:3000";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${callbackBaseURL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (!req.user) return done(new Error("No logged-in user"));

        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser && existingUser.id !== req.user.id) {
          return done(new Error("Google account is already linked to another user."));
        }

        req.user.googleId = profile.id;
        req.user.email = profile.emails?.[0]?.value || req.user.email;
        await req.user.save();

        done(null, req.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
