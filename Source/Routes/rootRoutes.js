import express from 'express';
import usersRouter from './usersRoutes.js'; 
import authRouter from './authRoutes.js';
import productsRouter from './productRoutes.js';
import ordersRouter from './orderRoutes.js';
import categoryRounter from './cateRoutes.js';

const rootRouter = express.Router();


rootRouter.use('/users', usersRouter);
rootRouter.use('/auth',authRouter);
rootRouter.use('/products',productsRouter);
rootRouter.use('/orders',ordersRouter);
rootRouter.use('/categories',categoryRounter)

export default rootRouter;
