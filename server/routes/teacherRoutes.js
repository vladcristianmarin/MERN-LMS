import express from 'express';
const router = express.Router();

import { getTeachers } from '../controllers/teacherController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getTeachers);

export default router;
