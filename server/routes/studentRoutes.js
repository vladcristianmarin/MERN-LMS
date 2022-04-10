import express from 'express';
const router = express.Router();

import { changeStudentGroup, getStudents } from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getStudents);
router.route('/:id/changeGroup').patch(protect, admin, changeStudentGroup);

export default router;
