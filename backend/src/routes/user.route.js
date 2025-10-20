import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { changePassword, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/changePassword", authenticateToken, changePassword);
router.post("/updateProfile", authenticateToken, updateProfile);

export default router;