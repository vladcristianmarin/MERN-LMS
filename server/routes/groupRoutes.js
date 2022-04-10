import express from 'express';
const router = express.Router();
import {
	addCourseToGroup,
	addStudents,
	createGroup,
	deleteGroup,
	getGroups,
	removeCourse,
	removeStudent,
	updateGroup,
} from '../controllers/groupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createGroup).get(protect, admin, getGroups);

router.route('/:id/courses').post(protect, admin, addCourseToGroup);
router.route('/:groupId/courses/:courseId').delete(protect, admin, removeCourse);
router
	.route('/:id')
	.post(protect, admin, addStudents)
	.delete(protect, admin, deleteGroup)
	.patch(protect, admin, updateGroup);
router.route('/:groupId/students/:studentId').delete(protect, admin, removeStudent);

export default router;
