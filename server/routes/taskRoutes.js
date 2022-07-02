import express from 'express';
import { createTask, deleteTask, doneTask, fetchTasks } from '../controllers/taskController.js';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, fetchTasks).put(protect, createTask).patch(protect, doneTask);
router.route('/:taskId').delete(protect, deleteTask);

export default router;
