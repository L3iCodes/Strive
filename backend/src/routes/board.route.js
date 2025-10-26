import express from 'express';
import { createBoard, deleteBoard, getBoardList, getKanbanBoard, leaveBoard, updateBoard, updateLastOpened } from '../controllers/board.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/boards',authenticateToken, getBoardList);
router.get('/:id',authenticateToken, getKanbanBoard);

router.post('/create',authenticateToken, createBoard);
router.post('/update',authenticateToken, updateBoard);
router.post('/leave',authenticateToken, leaveBoard);
router.delete('/delete/:boardId',authenticateToken, deleteBoard);
router.post('/updateLastOpened',authenticateToken, updateLastOpened);

export default router;