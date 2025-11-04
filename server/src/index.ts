import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';

import messageRoutes from './routes/messages';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import channelRoute from './routes/channels';
import { socketSetUp } from './socketio';

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || '3000', 10);

if ( !process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}
const MONGO_URI = `${process.env.MONGO_URI}`;

const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['*'];

const options = {
    cors: {
      origin: CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
  }
};

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, options);

app.use(cors(options.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoute);

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', ts: new Date().toISOString() });
});


socketSetUp(io);

const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

// If a request is a GET and doesn’t start with /api, serve index.html.
// This avoids using app.get('*', …) (which can trip path-to-regexp in some versions).
app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === 'GET' &&
    !req.path.startsWith('/api') &&
    req.accepts('html')
  ) {
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
  next();
});


// any thrown error in routes ends up here)
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Internal Server Error' });
  }
);

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
})();
