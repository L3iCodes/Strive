import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { addSubtask, createTask, deleteSubtask, deleteTask, getTask, moveTask, updateSubtask, updateTaskInfo } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/:taskId',authenticateToken, getTask);
router.post('/create',authenticateToken, createTask);
router.post('/update',authenticateToken, updateTaskInfo);
router.delete('/delete/:taskId',authenticateToken, deleteTask);
router.post('/task/move',authenticateToken, moveTask);

router.post('/subtask/add',authenticateToken, addSubtask);
router.post('/subtask/update',authenticateToken, updateSubtask);
router.post('/subtask/delete',authenticateToken, deleteSubtask);

export default router;