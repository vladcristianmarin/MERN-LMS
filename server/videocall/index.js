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
		meetings[meetingId].push({ ...user, socketId: socket.id });
		participantRef[socket.id] = { meetingId, user };

		socket.broadcast.to(meetingId).emit('userConnected', user);
		io.to(meetingId).emit('setParticipants', meetings[meetingId]);

		socket.on('message', (message) => {
			socket.emit('createMessage', message);
		});

		socket.on('toggleMic', (socketId) => {
			io.to(socketId).emit('toggleMic');
		});

		socket.on('toggleCam', (socketId) => {
			io.to(socketId).emit('toggleCam');
		});

		socket.on('toggledOwnCam', (id) => {
			socket.broadcast.to(meetingId).emit('toggledOwnCam', id);
		});

		socket.on('toggledOwnMic', (id) => {
			socket.broadcast.to(meetingId).emit('toggledOwnMic', id);
		});

		socket.on('userLeftMeeting', () => {
			socket.broadcast.to(meetingId).emit('userDisconnected', user);
			meetings[meetingId] = meetings[meetingId].filter((u) => u._id !== user._id);
		});

		socket.on('endMeeting', async (user) => {
			console.log(starters[meetingId]);
			console.log(user._id);
			if (starters[meetingId] === user._id) {
				await Course.findByIdAndUpdate(meetingId, { inCall: false });
				socket.broadcast.to(meetingId).emit('meetingEnded', user);
			}
		});

		socket.on('disconnect', () => {
			if (participantRef[socket.id]) {
				const { meetingId, user } = participantRef[socket.id];
				socket.broadcast.to(meetingId).emit('userDisconnected', user);
				meetings[meetingId] = meetings[meetingId].filter((u) => u._id !== user._id);
				delete participantRef[socket.id];
			}
		});
	});
};
