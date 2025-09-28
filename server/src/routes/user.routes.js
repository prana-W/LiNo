import {Router} from "express";
import {signupUser} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/signup").post(signupUser);
//
// router.routes("/login").post()

export default userRouter;