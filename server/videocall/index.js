export const videoCallHandler = (socket, io) => {
	socket.on('user joined room', (roomId) => {
		const room = io.sockets.adapter.rooms.get(roomId);

		const otherUsers = [];

		if (room) {
			room.forEach((id) => {
				otherUsers.push(id);
			});
		}

		socket.join(roomId);
		socket.emit('all other users', otherUsers);
	});

	socket.on('peer connection request', ({ userIdToCall, sdp }) => {
		io.to(userIdToCall).emit('connection offer', { sdp, callerId: socket.id });
	});

	socket.on('connection answer', ({ userToAnswerTo, sdp }) => {
		io.to(userToAnswerTo).emit('connection answer', { sdp, answererId: socket.id });
	});

	socket.on('ice-candidate', ({ target, candidate }) => {
		io.to(target).emit('ice-candidate', { candidate, from: socket.id });
	});

	socket.on('disconnecting', () => {
		socket.rooms.forEach((room) => {
			socket.to(room).emit('user disconnected', socket.id);
		});
	});

	socket.on('toggle remote cam', (targetId) => {
		io.to(targetId).emit('toggle cam');
	});

	socket.on('toggle remote mic', (targetId) => {
		io.to(targetId).emit('toggle mic');
	});
};
