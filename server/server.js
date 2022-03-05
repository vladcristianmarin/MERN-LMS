import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';

import connectDB from './config/database.js';

import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3030;

app.use(notFound);
app.use(errorHandler);

app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
