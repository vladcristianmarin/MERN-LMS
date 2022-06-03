import User from '../models/userModel.js';
import Course from '../models/courseModel.js';

const meetings = {};
const starters = {};
const participantRef = {};

export const videoCallHandler = (socket, io) => {
	socket.on('userJoinedMeeting', async (meetingId, user, err) => {
		if (!meetings[meetingId]) {
			try {
				const userFromDb = await User.findById(user._id);
				const course = await Course.findById(meetingId);
				if (!course) {
					return err('Invalid course id!');
				}
				if (!userFromDb) {
					return err('Invalid user! Please login as a real user!');
				}
				if (userFromDb.role === 'Student') {
					return err('Students cannot start meetings!');
				}
				if (!course.teacher.equals(userFromDb._id)) {
					return err('Cannot start other people meetings!');
				}
				meetings[meetingId] = [];
				course.inCall = true;
				await course.save();
				starters[meetingId] = user._id;
			} catch (e) {
				err("Meeting didn't started");
				return;
			}
		}
		err(null);
		socket.join(meetingId);
		meetings[meetingId].push({ ...user, socketId: socket.id, isMuted: false, isHidden: false });
		participantRef[socket.id] = { meetingId, user };

		socket.broadcast.to(meetingId).emit('userConnected', user);
		io.to(meetingId).emit('setParticipants', meetings[meetingId]);

		socket.on('message', (message) => {
			if (!meetings[meetingId].messages) {
				meetings[meetingId].messages = [];
			}
			meetings[meetingId].messages.push(message);
			io.to(meetingId).emit('receiveMessage', message);
		});

		socket.on('fetchMessages', () => {
			let messages = [];
			if (meetings[meetingId] && meetings[meetingId].messages) {
				messages = meetings[meetingId].messages;
			}
			socket.emit('listMessages', messages);
		});

		socket.on('toggleMic', (socketId) => {
			const userFromSocket = participantRef[socketId].user;
			const user = meetings[meetingId].find((u) => u._id === userFromSocket._id);
			user.isMuted = !user.isMuted;
			io.to(socketId).emit('toggleMic');
			io.to(meetingId).emit('updateParticipant', user);
		});

		socket.on('toggleCam', (socketId) => {
			const userFromSocket = participantRef[socketId].user;
			const user = meetings[meetingId].find((u) => u._id === userFromSocket._id);
			user.isHidden = !user.isHidden;
			io.to(socketId).emit('toggleCam');
			io.to(meetingId).emit('updateParticipant', user);
		});

		socket.on('toggleOwnCam', (id) => {
			const user = meetings[meetingId].find((u) => u._id === id);
			user.isHidden = !user.isHidden;
			socket.broadcast.to(meetingId).emit('toggleOwnCam', id);
			socket.to(meetingId).emit('updateParticipant', user);
		});

		socket.on('toggleOwnMic', (id) => {
			const user = meetings[meetingId].find((u) => u._id === id);
			user.isMuted = !user.isMuted;
			socket.broadcast.to(meetingId).emit('toggleOwnMic', id);
			socket.to(meetingId).emit('updateParticipant', user);
		});

		socket.on('userLeftMeeting', () => {
			socket.broadcast.to(meetingId).emit('userDisconnected', user);
			if (meetings[meetingId]) meetings[meetingId] = meetings[meetingId].filter((u) => u._id !== user._id);
		});

		socket.on('userKicked', (socketId) => {
			io.to(socketId).emit('meetingEnded');
		});

		socket.on('endMeeting', async (user) => {
			if (starters[meetingId] === user._id) {
				await Course.findByIdAndUpdate(meetingId, { inCall: false });
				socket.broadcast.to(meetingId).emit('meetingEnded', user);
				meetings[meetingId] = null;
			}
		});

		socket.on('disconnect', () => {
			if (participantRef[socket.id]) {
				const { meetingId, user } = participantRef[socket.id];
				socket.broadcast.to(meetingId).emit('userDisconnected', user);
				socket.leave(meetingId);
				if (meetings[meetingId]) {
					meetings[meetingId] = meetings[meetingId].filter((u) => u._id !== user._id);
				}
				delete participantRef[socket.id];
			}
		});
	});
};
