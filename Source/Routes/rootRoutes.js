import express from 'express';
import usersRouter from './usersRoutes.js'; // Ensure this path is correct
import authRouter from './authRoutes.js';

const rootRouter = express.Router();

// Mount usersRouter at /users
rootRouter.use('/users', usersRouter);
rootRouter.use('/auth',authRouter);

export default rootRouter;
