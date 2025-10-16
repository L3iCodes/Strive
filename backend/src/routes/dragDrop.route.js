import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { reorderSection } from '../controllers/dragDrop.controller.js';

const router = express.Router();

router.post('/reorderSection', authenticateToken, reorderSection);

export default router;