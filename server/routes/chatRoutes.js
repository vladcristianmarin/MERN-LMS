import express from 'express';
const router = express.Router();
import {
	addToGroupChat,
	createGroupChat,
	fetchChatById,
	fetchChats,
	removeFromGroupChat,
	renameGroupChat,
} from '../controllers/chatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, fetchChats);
router.route('/:chatId').get(protect, fetchChatById);
router
	.route('/group')
	.post(protect, admin, createGroupChat)
	.delete(protect, admin, removeFromGroupChat)
	.put(protect, admin, addToGroupChat)
	.patch(protect, admin, renameGroupChat);

export default router;
