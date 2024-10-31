import { Router } from 'express';
import { CreateANewOrder,GetAllDeliveringOrder,GetAllOrder,GetAllProcessingOrder,updateDeliveryOrder,GetAllSuccedOrder,GetOrderByCID,GetOrderByID } from '../Controller/ORDERControler.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const ordersRouter = Router();

ordersRouter.post('/create_order', CreateANewOrder);

ordersRouter.get('/customer/:customerId', GetOrderByCID);

ordersRouter.get('/all', GetAllOrder);

ordersRouter.get('/status/processing', GetAllProcessingOrder);

ordersRouter.get('/status/delivering', GetAllDeliveringOrder);

ordersRouter.get('/status/succeeded', GetAllSuccedOrder);

ordersRouter.get('/get_OrderByID/:orderId',GetOrderByID);

ordersRouter.put('/updateDeli/:orderId', updateDeliveryOrder);


export default ordersRouter;