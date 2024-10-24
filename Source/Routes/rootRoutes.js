import express from 'express';
import usersRouter from './usersRoutes.js'; 
import authRouter from './authRoutes.js';
import productsRouter from './productRoutes.js';
import ordersRouter from './orderRoutes.js';
import categoryRounter from './cateRoutes.js';
import purchaseRouter from './purchaseRoutes.js';
import storageRouter from './storageRoutes.js';
import smRouter from './smRoutes.js';

const rootRouter = express.Router();


rootRouter.use('/users', usersRouter);
rootRouter.use('/auth',authRouter);
rootRouter.use('/products',productsRouter);
rootRouter.use('/orders',ordersRouter);
rootRouter.use('/categories',categoryRounter);
rootRouter.use('/purchase',purchaseRouter);
rootRouter.use('/storage', storageRouter);
rootRouter.use('/sm',smRouter);


export default rootRouter;
