import express from 'express';
const router = express.Router();
import { addStudents, createGroup, deleteGroup, getGroups } from '../controllers/groupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createGroup).get(protect, admin, getGroups);
router.route('/:id').post(protect, admin, addStudents).delete(protect, admin, deleteGroup);

export default router;
