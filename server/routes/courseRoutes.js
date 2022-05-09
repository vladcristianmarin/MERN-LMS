import express from 'express';
const router = express.Router();
import { createCourse, deleteCourse, getCourse, getCourses, updateCourse } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createCourse).get(protect, admin, getCourses);
router.route('/:id').delete(protect, admin, deleteCourse).patch(protect, admin, updateCourse).get(protect, getCourse);

export default router;
