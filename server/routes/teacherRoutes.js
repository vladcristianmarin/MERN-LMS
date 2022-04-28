import express from 'express';
const router = express.Router();

import { getTeachers, getTeacherCourses, getMyCourses } from '../controllers/teacherController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getTeachers);
router.route('/mycourses').get(protect, getMyCourses);
router.route('/:id/courses').get(protect, admin, getTeacherCourses);

export default router;
