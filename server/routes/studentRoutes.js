import express from 'express';
const router = express.Router();

import { getStudents } from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getStudents);

export default router;
