import colors from 'colors';
import dotenv from 'dotenv';

import connectDB from './config/database.js';

dotenv.config();

connectDB();