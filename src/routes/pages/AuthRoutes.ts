// Init router
import Paths from '@src/common/constants/Paths';
import { Login, Signup } from '@src/controllers/AuthController';
import { Router } from 'express';
const authRouter = Router();


// Signup route
authRouter.post(Paths.Auth.Signup, Signup);
// Login route
authRouter.post(Paths.Auth.Login, Login); // Assuming Login uses the same controller for now


export default authRouter;