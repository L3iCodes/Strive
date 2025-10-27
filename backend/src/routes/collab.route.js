import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { clearNotification, getInvites, inviteResponse, inviteUser, requestAccess, requestResponse, updateRole } from '../controllers/collab.controller.js';

const router = express.Router();

router.get('/getInvite', authenticateToken, getInvites);
router.post('/invite', authenticateToken, inviteUser);
router.post('/response', authenticateToken, inviteResponse);

router.post('/request', authenticateToken, requestAccess);
router.post('/requestResponse', authenticateToken, requestResponse);

router.post('/updateRole', authenticateToken, updateRole);
router.delete('/clearNotification', authenticateToken, clearNotification);

export default router;