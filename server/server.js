import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
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
import taskRoutes from './routes/taskRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import examRoutes from './routes/examRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { videoCallHandler } from './videocall/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { PeerServer } from 'peer';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// if (process.env.NODE_ENV === 'development') {
// 	app.use(morgan('dev'));
// }

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/exams', examRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));
	app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

const io = new Server(server, {
	pingTimeout: 60000,
	cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

const peer = new PeerServer({ port: 9001, key: 'peerjs', path: '/peerjs', proxied: true });
app.use(peer);

io.on('connection', (socket) => {
	console.log('User connected to the server'.bgGreen);
	socket.on('join', ({ user, room }, cb) => {
		socket.join(room);
		console.log(`${user.name} joined room ${room}`);
		cb(null);

		socket.on('sendMessage', (message) => {
			io.to(room).emit('receiveMessage', message);
		});

		socket.on('typing', () => {
			socket.in(room).emit('typing', user);
		});

		socket.on('stopTyping', () => socket.in(room).emit('stopTyping'));
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	videoCallHandler(socket, io);
});

server.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
