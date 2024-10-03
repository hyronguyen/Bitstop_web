import { Router } from 'express';
import { CreateANewPurchaseOrder } from '../Controller/PURCHASEControler.js';

const purchaseRouter = Router();

purchaseRouter.post('/create_purchase', CreateANewPurchaseOrder);




export default purchaseRouter;