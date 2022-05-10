import express from 'express';
const router = express.Router();
import {
	createCourse,
	deleteCourse,
	getCourse,
	getCourses,
	updateCourse,
	uploadResource,
} from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, access } from '../middleware/resourceUploadMiddleware.js';

router.route('/').post(protect, admin, createCourse).get(protect, admin, getCourses);
router.route('/:id').delete(protect, admin, deleteCourse).patch(protect, admin, updateCourse).get(protect, getCourse);
router.route('/:id/resources').post(protect, access, upload.single('resource'), uploadResource);

export default router;
