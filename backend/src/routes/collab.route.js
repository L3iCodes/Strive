import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getInvites, inviteResponse, inviteUser, requestAccess, requestResponse, updateRole } from '../controllers/collab.controller.js';

const router = express.Router();

router.get('/getInvite', authenticateToken, getInvites);
router.post('/invite', authenticateToken, inviteUser);
router.post('/response', authenticateToken, inviteResponse);

router.post('/request', authenticateToken, requestAccess);
router.post('/requestResponse', authenticateToken, requestResponse);

router.post('/updateRole', authenticateToken, updateRole);

export default router;