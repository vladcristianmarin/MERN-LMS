import express from 'express';
import { createExam, getStudentExams } from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, createExam);
router.get('/student', protect, getStudentExams);

export default router;
