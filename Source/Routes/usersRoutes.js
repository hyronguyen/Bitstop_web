import { Router } from 'express';
import { getAllUsers, createUser } from '../Controller/USERSConntroler.js';

const usersRouter = Router();

// Route to get all users
usersRouter.get('/get_users', getAllUsers);

// Route to create a new user
usersRouter.post('/create_users', createUser);

export default usersRouter;
