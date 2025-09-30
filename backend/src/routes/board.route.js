import express from 'express';
import { createBoard, getBoardList } from '../controllers/board.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/boards',authenticateToken, getBoardList);
router.post('/create',authenticateToken, createBoard);

export default router;