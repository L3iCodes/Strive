import express from 'express';
import { createBoard, getBoardList, getKanbanBoard } from '../controllers/board.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/boards',authenticateToken, getBoardList);
router.get('/:id',authenticateToken, getKanbanBoard);

router.post('/create',authenticateToken, createBoard);

export default router;