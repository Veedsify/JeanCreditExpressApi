import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import userRouter from './pages/UserRoutes';


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
apiRouter.use(Paths.Users.Base, userRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
