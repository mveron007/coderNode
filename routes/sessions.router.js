import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.get('/login/github', passport.authenticate('github'));

sessionRouter.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/user/' }),
  (req, res) => {
    req.session.user = req.user;
    res.render('profile', { user: req.session.user });
  }
);

export default sessionRouter;