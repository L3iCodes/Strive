import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createTask, deleteTask, updateTaskInfo } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/create',authenticateToken, createTask);
router.post('/update',authenticateToken, updateTaskInfo);
router.delete('/delete/:taskId',authenticateToken, deleteTask);

export default router;