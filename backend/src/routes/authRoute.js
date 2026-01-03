import express from "express";
import isAuth from "../middlewares/isAuth.js"
import passport from "passport";
import { login, logout, signup ,getMe, googleSuccess} from "../controllers/authController.js";
const authRouter=express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.get("/me", isAuth, getMe)

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  googleSuccess
);


export default authRouter