import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import assignmentRoutes from './routes/assignment';
import './workers/aiWorker';

dotenv.config();

const app = express();
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

export const io = new Server(server, {
  cors: {
    origin: frontendUrl === '*' ? '*' : [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: frontendUrl === '*' ? '*' : [frontendUrl, 'http://localhost:3000'] }));
app.use(express.json());

app.use('/api/assignments', assignmentRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
