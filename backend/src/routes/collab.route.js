import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getInvites, inviteUser } from '../controllers/collab.controller.js';

const router = express.Router();

router.get('/getInvite', authenticateToken, getInvites);
router.post('/invite', authenticateToken, inviteUser);

export default router;