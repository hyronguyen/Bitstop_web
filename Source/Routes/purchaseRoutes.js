import { Router } from 'express';
import { CreateANewPurchaseOrder, GetAllPurchase } from '../Controller/PURCHASEControler.js';

const purchaseRouter = Router();

purchaseRouter.post('/create_purchase', CreateANewPurchaseOrder);
purchaseRouter.get('/get_allpurchase',GetAllPurchase);


export default purchaseRouter;