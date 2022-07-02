import express from 'express';
import { createTask, deleteTask, doneTask, fetchTasks } from '../controllers/taskController.js';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

router
	.route('/')
	.get(protect, fetchTasks)
	.put(protect, createTask)
	.delete(protect, deleteTask)
	.patch(protect, doneTask);

export default router;
