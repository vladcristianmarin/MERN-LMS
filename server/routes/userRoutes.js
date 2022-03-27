import express from 'express';
const router = express.Router();
import { authUser, registerUser, logoutUser, verifyToken, makeAdmin } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser);
router.route('/login').post(authUser);
router.route('/logout').post(protect, logoutUser);
router.route('/verify/:token').get(verifyToken);
router.post('/:id/grantAdmin', protect, admin, makeAdmin);

export default router;
