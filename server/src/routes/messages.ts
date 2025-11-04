import * as express from 'express';
import {getMessagesOfUsers, getChannelMessages, searchMessages } from '../controllers/messagesController';

const messagesRouter: express.Router = express.Router();

messagesRouter.get('/:firstUser/:secondUser', getMessagesOfUsers);
messagesRouter.get('/:channelId', getChannelMessages);
messagesRouter.post('/search', searchMessages);

export default messagesRouter;