import express from 'express';
const router = express.Router();
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/:chatId').get(protect, getMessages).post(protect, sendMessage);

export default router;
