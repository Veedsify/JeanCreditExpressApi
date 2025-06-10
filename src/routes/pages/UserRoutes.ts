// Init router
import Paths from '@src/common/constants/Paths';
import { AllUsers } from '@src/controllers/UserController';
import { Router } from 'express';
const userRouter = Router();


userRouter.get(Paths.Users.Get, AllUsers);


export default userRouter;