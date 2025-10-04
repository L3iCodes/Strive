import express from 'express';
import { createBoard, deleteBoard, getBoardList, getKanbanBoard } from '../controllers/board.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/boards',authenticateToken, getBoardList);
router.get('/:id',authenticateToken, getKanbanBoard);

router.post('/create',authenticateToken, createBoard);
router.delete('/delete/:boardId',authenticateToken, deleteBoard);

export default router;