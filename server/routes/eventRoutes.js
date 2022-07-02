import express from 'express';
import { createEvent, deleteEvent, fetchEvents } from '../controllers/eventController.js';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, fetchEvents).put(protect, createEvent).delete(protect, deleteEvent);

export default router;
