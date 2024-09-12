import express from 'express';
import usersRouter from './usersRoutes.js'; 
import authRouter from './authRoutes.js';
import productsRouter from './productRoutes.js';

const rootRouter = express.Router();


rootRouter.use('/users', usersRouter);
rootRouter.use('/auth',authRouter);
rootRouter.use('/products',productsRouter);

export default rootRouter;
