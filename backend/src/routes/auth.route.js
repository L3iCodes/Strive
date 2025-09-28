import express from 'express';
import { checkAuth, login, logout, signup } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/verify", authenticateToken, checkAuth);

export default router;