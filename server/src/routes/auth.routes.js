import {Router} from 'express';
import {loginUser, signupUser} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.route('/signup').post(signupUser);
authRouter.route('/login').post(loginUser);

export default authRouter;
