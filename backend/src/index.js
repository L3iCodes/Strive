import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/database.js';
import authRoutes from './routes/auth.route.js'

dotenv.config();

const app = express();
app.listen(process.env.PORT, () => {
    console.log("Listening at PORT: ", process.env.PORT);
    connectDB();
});

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);