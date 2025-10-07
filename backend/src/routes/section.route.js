import express from 'express';
import { createSection, deleteSection, updateSection } from '../controllers/section.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createSection);
router.post('/update', authenticateToken, updateSection);
router.delete('/delete/:sectionId', authenticateToken, deleteSection);

export default router;