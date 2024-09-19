import { Router } from 'express';
import { CreateANewOrder } from '../Controller/ORDERControler.js';


const ordersRouter = Router();

ordersRouter.post('/create_order', CreateANewOrder);

export default ordersRouter;