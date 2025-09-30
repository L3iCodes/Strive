import express from 'express';
import { createSection } from '../controllers/section.controller.js';

const router = express.Router();

router.post('/create', createSection);

export default router;