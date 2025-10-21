import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/database.js';
import authRoutes from './routes/auth.route.js'
import sectionRoutes from './routes/section.route.js'
import boardRoutes from './routes/board.route.js'
import taskRoutes from './routes/task.route.js'
import collabRoutes from './routes/collab.route.js'
import dragDropRoutes from './routes/dragDrop.route.js'
import userRoutes from './routes/user.route.js'
import { app, server } from './lib/socket.js'

dotenv.config();

server.listen(process.env.PORT, () => {
    console.log("Listening at PORT: ", process.env.PORT);
    connectDB();
});

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/dragDrop', dragDropRoutes);
app.use('/api/user', userRoutes);