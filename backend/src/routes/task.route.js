import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createTask } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/create',authenticateToken, createTask);

export default router;