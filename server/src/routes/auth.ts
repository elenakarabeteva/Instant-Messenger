import * as express from 'express';
import {login, register} from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

// authRouter.get('/profile/:email', profile);

export default authRouter;