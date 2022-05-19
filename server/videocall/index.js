const users = {};
const socketToRoom = {};

export const videoCallHandler = (socket, io) => {
	socket.on('join room', ({ meetingId, user }) => {
		if (users[meetingId]) {
			users[meetingId].push(user);
		} else {
			users[meetingId] = [user];
		}
		socketToRoom[socket.id] = { userId: user.userId, meetingId };
		const usersInThisRoom = users[meetingId].filter((_user) => user.userId !== _user.userId);

		socket.emit('all users', usersInThisRoom);
	});

	socket.on('sending signal', ({ userToSignal, caller, signal }) => {
		io.to(userToSignal.socketId).emit('user joined', { signal, caller });
	});

	socket.on('returning signal', ({ signal, caller }) => {
		io.to(caller.socketId).emit('receiving returned signal', { signal, userId: caller.userId });
	});

	socket.on('disconnect', () => {
		//TODO: IMPLEMENT DISCONNECTING
		if (socketToRoom[socket.id]) {
			const { meetingId, userId } = socketToRoom[socket.id];
			const newUsers = users[meetingId].filter((user) => user.userId !== userId);
			users[meetingId] = newUsers;
			const userToSend = users[meetingId].map((user) => user.socketId);
			io.to(userToSend).emit('refresh users', newUsers);
		}
	});
};
