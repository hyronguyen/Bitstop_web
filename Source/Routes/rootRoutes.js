import express from 'express';
import usersRouter from './usersRoutes.js'; // Ensure this path is correct

const rootRouter = express.Router();

// Mount usersRouter at /users
rootRouter.use('/users', usersRouter);

export default rootRouter;
