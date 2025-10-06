import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { addSubtask, createTask, deleteTask, getTask, updateTaskInfo } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/:taskId',authenticateToken, getTask);
router.post('/create',authenticateToken, createTask);
router.post('/update',authenticateToken, updateTaskInfo);
router.delete('/delete/:taskId',authenticateToken, deleteTask);

router.post('/subtask/add',authenticateToken, addSubtask);

export default router;