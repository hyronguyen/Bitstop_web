import { Router } from 'express';
import {  getStorgeItems,getPurchaseItems} from '../Controller/STORAGEController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const storageRouter = Router();

storageRouter.get('/get_storageItems',getStorgeItems);
storageRouter.get('/get_PurchaseItems',getPurchaseItems);

export default storageRouter;