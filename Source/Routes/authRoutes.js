import { Router } from 'express';
import { registerUser, loginUser } from '../Controller/AUTControler.js';
import { sendMail } from '../Utils/sendmail.js';
const authRouter = Router();

// Register new user
authRouter.post('/register', registerUser);

// Login existing user
authRouter.post('/login', loginUser);
authRouter.post('/send-email', sendMail); // Định nghĩa route gửi email


export default authRouter;
