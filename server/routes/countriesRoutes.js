import express from 'express';
const router = express.Router();
import { getCountries } from '../controllers/countriesController.js';

router.get('/', getCountries);

export default router;
