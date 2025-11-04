import * as express from 'express';
import { Message } from "../models/mesage";

export const getMessagesOfUsers = async (request: express.Request, response: express.Response) => {
  const { firstUser, secondUser } = request.params;

  const chatMessages = await Message.find({
    $or: [
      { sender: firstUser, receiver: secondUser },
      { sender: secondUser, receiver: firstUser }
    ]
  }).sort({ timestamp: 1 });
  response.status(200).json(chatMessages);
};


export const getChannelMessages = async (request: express.Request, response: express.Response) => {
  try {
    const { channelId } = request.params;
    const messages = await Message.find({ chat_id: channelId }).sort({ timestamp: 1 });
    response.status(200).json(messages);
  } catch (err) {
    response.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

export const searchMessages = async (request: express.Request, response: express.Response) => {
  try {
    const { searchQuery, channelId } = request.body;

    const searchTerm = (searchQuery || '').toString().trim();
    const chat = (channelId || 'all').toString();

    // Build a Mongo filter object
    const filter: Record<string, any> = {};

    if (searchTerm) {
      filter.content = { $regex: searchTerm, $options: 'i' };
    }

    if (chat !== 'all') {
      filter.chat_id = chat;
    }

    const filteredMessages = await Message.find(filter).exec();

    return response.status(200).json(filteredMessages);
  } catch (err) {
    return response.status(500).json({ error: (err as Error).message });
  }
};
