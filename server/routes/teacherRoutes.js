import express from 'express';
const router = express.Router();

import { getTeachers, getTeacherCourses } from '../controllers/teacherController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getTeachers);
router.route('/:id/courses').get(protect, admin, getTeacherCourses);

export default router;
