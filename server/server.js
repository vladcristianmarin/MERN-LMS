import { Server } from 'socket.io';
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
console.log(path.join(__dirname, '/uploads'));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));
	app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

const server = app.listen(
	PORT,
	console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

const io = new Server(server, {
	pingTimeout: 60000,
	cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
	console.log('user connected to the server'.bgGreen);
	socket.on('setup', (user) => {
		socket.join(user._id);
		socket.emit('connected');
	});

	socket.on('join chat', (room) => {
		console.log(`User joined room: ${room}`.bgYellow);
		socket.join(room);
	});

	socket.on('typing', (room, user) => {
		socket.in(room).emit('typing', user);
	});
	socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

	socket.on('send message', (message) => {
		const chat = message.chat;
		if (!chat.users) {
			return console.log('chat.users not defined'.bgRed.bold);
		}

		// chat.users.forEach((user) => {
		// 	if (user._id !== message.sender._id) {
		// 		socket.in(user._id).emit('message received', message);
		// 	}
		// });

		console.log(socket.rooms);

		socket.in(message.chat._id).emit('message received', message);
	});

	socket.on('leave chat', (chat) => socket.leave(chat._id));

	socket.off('setup', (user) => {
		socket.leave(user._id);
		console.log('socket.off').bgRed;
	});

	socket.on('connect_error', (err) => {
		console.log(`connect_error due to ${err.message}`);
	});
});
