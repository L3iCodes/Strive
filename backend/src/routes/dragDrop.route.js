import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { dragTask, reorderSection } from '../controllers/dragDrop.controller.js';

const router = express.Router();

router.post('/reorderSection', authenticateToken, reorderSection);
router.post('/dragTask', authenticateToken, dragTask);

export default router;