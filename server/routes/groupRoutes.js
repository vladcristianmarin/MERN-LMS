import express from 'express';
import { getCourses } from '../controllers/courseController.js';
const router = express.Router();
import { createGroup } from '../controllers/groupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createGroup).get(protect, admin, getCourses);

export default router;
