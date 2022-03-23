import express from 'express';
const router = express.Router();
import { createCourse, getCourses } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createCourse).get(protect, admin, getCourses);

export default router;
