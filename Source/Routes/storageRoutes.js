import { Router } from 'express';
import {  getStorgeItems,getPurchaseItems,updateStorageQuantity} from '../Controller/STORAGEController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const storageRouter = Router();

storageRouter.get('/get_storageItems',getStorgeItems);
storageRouter.get('/get_PurchaseItems',getPurchaseItems);

// Route để cập nhật số lượng sản phẩm
storageRouter.put('/update_StorageQuantity', updateStorageQuantity);

export default storageRouter;