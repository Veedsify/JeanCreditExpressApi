import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import { Login, Signup } from '@src/controllers/AuthController';
import { validateFields, validateEmail, validatePassword } from '@src/middleware/validation';

const authRouter = Router();

// Signup route with validation
authRouter.post(
    Paths.Auth.Signup,
    validateFields(['firstName', 'lastName', 'email', 'password']),
    validateEmail,
    validatePassword,
    Signup
);

// Login route with validation
authRouter.post(
    Paths.Auth.Login,
    validateFields(['email', 'password']),
    validateEmail,
    Login
);

export default authRouter;