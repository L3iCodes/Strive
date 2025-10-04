import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/create',authenticateToken, createTask);
router.delete('/delete/:taskId',authenticateToken, deleteTask);

export default router;