import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import userRouter from './pages/UserRoutes';
import authRouter from './pages/AuthRoutes';


/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();


// ** Add UserRouter ** //



// Get all users
// userRouter.get(Paths.Users.Get, );
// userRouter.post(Paths.Users.Add, );
// userRouter.put(Paths.Users.Update, );
// userRouter.delete(Paths.Users.Delete, );

// Add UserRouter
apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Users.Base, userRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
