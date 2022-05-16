import { v4 as uuidV4 } from 'uuid';

const meetings = {};

export const videoCallHandler = (socket) => {
	const startMeeting = () => {
		console.log('Meeting has started!');
		const meetingId = uuidV4();
		console.log(meetingId);
		meetings[meetingId] = {};
		socket.emit('meetingCreated', { meetingId });
	};
	const joinMeeting = ({ meetingId, peerId, userName }) => {
		meetings[meetingId][peerId] = { peerId, userName };
		socket.join(meetingId);
		socket.to(meetingId).emit('userJoined', { peerId, userName });
		socket.emit('getUsers', {
			meetingId,
			participants: meetings[meetingId],
		});

		socket.on('disconnect', () => {
			leaveMeeting({ meetingId, peerId });
		});
	};
	const leaveMeeting = ({ meetingId, peerId }) => {
		socket.to(meetingId).emit('userDisconnected', peerId);
	};
	const startSharing = ({ meetingId, peerId }) => {
		socket.to(meetingId).emit('userStartedSharing', peerId);
	};
	const stopSharing = ({ meetingId }) => {
		socket.to(meetingId).emit('userStoppedSharing');
	};

	socket.on('startMeeting', startMeeting);
	socket.on('joinMeeting', joinMeeting);
	socket.on('leaveMeeting', leaveMeeting);
	socket.on('startSharing', startSharing);
	socket.on('stopSharing', stopSharing);
};
