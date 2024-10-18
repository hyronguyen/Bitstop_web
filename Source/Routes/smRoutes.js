import { Router } from 'express';
import { getSMItems,updateSMStatus,getDoneSMItems } from '../Controller/SMController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';  

const smRouter = Router();


smRouter.get('/get_smItems', getSMItems); 

smRouter.put('/update_SMStatus',updateSMStatus);
smRouter.get('/get_DoneSMItems',getDoneSMItems )



export default smRouter;
