import { Router } from 'express';
import { CreateANewOrder,GetAllDeliveringOrder,GetAllOrder,GetAllProcessingOrder,GetAllSuccedOrder,GetOrderByCID } from '../Controller/ORDERControler.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const ordersRouter = Router();

ordersRouter.post('/create_order', CreateANewOrder);

ordersRouter.get('/customer/:customerId', GetOrderByCID);

ordersRouter.get('/all', GetAllOrder);

ordersRouter.get('/status/processing', GetAllProcessingOrder);

ordersRouter.get('/status/delivering', GetAllDeliveringOrder);

ordersRouter.get('/status/succeeded', GetAllSuccedOrder);


export default ordersRouter;