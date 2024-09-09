import { Router } from 'express';
import { registerUser, loginUser } from '../Controller/AUTControler.js';
const authRouter = Router();

// Register new user
authRouter.post('/register', registerUser);
// Login existing user
authRouter.post('/login', loginUser);



export default authRouter;
