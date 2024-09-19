import { Router } from 'express';
import { getAllUsers,getUserByDocId,EditProfile } from '../Controller/USERSConntroler.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const usersRouter = Router();

// Route to get all users
usersRouter.get('/get_users', getAllUsers);

// Route lấy thông tin cá nhân 
usersRouter.get('/get_byDocID/:DocID',authMiddleware,getUserByDocId );

usersRouter.put('/edit_profile/:DocID', EditProfile);


export default usersRouter;
