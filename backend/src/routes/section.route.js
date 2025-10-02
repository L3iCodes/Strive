import express from 'express';
import { createSection, deleteSection } from '../controllers/section.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createSection);
router.post('/delete', authenticateToken, deleteSection);

export default router;