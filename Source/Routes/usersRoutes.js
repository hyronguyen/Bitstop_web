import { Router } from 'express';
import { getAllUsers } from '../Controller/USERSConntroler.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const usersRouter = Router();

// Route to get all users
usersRouter.get('/get_users', getAllUsers);


export default usersRouter;
