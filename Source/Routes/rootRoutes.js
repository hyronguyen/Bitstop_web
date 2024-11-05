import express from 'express';
import usersRouter from './usersRoutes.js'; 
import authRouter from './authRoutes.js';
import productsRouter from './productRoutes.js';
import ordersRouter from './orderRoutes.js';
import categoryRounter from './cateRoutes.js';
import purchaseRouter from './purchaseRoutes.js';
import storageRouter from './storageRoutes.js';
import smRouter from './smRoutes.js';
import couponRoutes from './couponRoutes.js';
import ticketsRouter from './ticketsRoutes.js';

const rootRouter = express.Router();


rootRouter.use('/users', usersRouter);
rootRouter.use('/auth',authRouter);
rootRouter.use('/products',productsRouter);
rootRouter.use('/orders',ordersRouter);
rootRouter.use('/categories',categoryRounter);
rootRouter.use('/purchase',purchaseRouter);
rootRouter.use('/storage', storageRouter);
rootRouter.use('/sm',smRouter);
rootRouter.use('/coupon',couponRoutes);
rootRouter.use('/tickets',ticketsRouter );


export default rootRouter;

