import { Router } from 'express';
import { getSMItems } from '../Controller/SMController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';  

const smRouter = Router();


smRouter.get('/get_smItems', getSMItems); 

export default smRouter;
