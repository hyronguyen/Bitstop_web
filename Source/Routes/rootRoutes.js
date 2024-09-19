import express from 'express';
import usersRouter from './usersRoutes.js'; 
import authRouter from './authRoutes.js';
import productsRouter from './productRoutes.js';
import ordersRouter from './orderRoutes.js';

const rootRouter = express.Router();


rootRouter.use('/users', usersRouter);
rootRouter.use('/auth',authRouter);
rootRouter.use('/products',productsRouter);
rootRouter.use('/orders',ordersRouter);

export default rootRouter;
