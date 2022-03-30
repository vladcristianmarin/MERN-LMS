import express from 'express';
const router = express.Router();
import { createGroup, getGroups } from '../controllers/groupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createGroup).get(protect, admin, getGroups);

export default router;
