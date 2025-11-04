import * as express from 'express';
import {getAllUsers, getUsersFromAChannel} from '../controllers/usersController';

const usersRouter: express.Router = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:channelId', getUsersFromAChannel);

export default usersRouter;