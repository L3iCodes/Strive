import express from 'express';
import { createSection } from '../controllers/section.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createSection);

export default router;