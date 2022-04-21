import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import colors from 'colors';
import morgan from 'morgan';

import connectDB from './config/database.js';

import userRoutes from './routes/userRoutes.js';
import countriesRoutes from './routes/countriesRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));
	app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
