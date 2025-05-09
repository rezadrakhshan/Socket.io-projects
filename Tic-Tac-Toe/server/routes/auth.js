import { Router } from 'express';
import passport from "../middleware/passport.js"

const router = Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/profile' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

export default router;
