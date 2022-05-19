import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import styled from '@emotion/styled';
import { Box, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ws } from '../ws';
import { useSelector } from 'react-redux';

const StyledVideo = styled('video')(() => ({
	height: '40%',
	width: '50%',
	transform: 'rotateY(180deg)',
}));

const Video = ({ peer }) => {
	const ref = useRef();
	useEffect(() => {
		if (peer.streams && peer.streams[0]) {
			ref.current.srcObject = peer.streams[0];
		}
	}, [peer]);
	return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

const MeetingScreen = () => {
	const [peers, setPeers] = useState([]);
	const [stream, setStream] = useState(null);
	const [user, setUser] = useState(null);

	const userVideo = useRef();

	const { meetingId } = useParams();

	const navigate = useNavigate();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				setStream(stream);
				userVideo.current.srcObject = stream;
			})
			.catch((_err) => {
				console.log(_err);
				setStream(new MediaStream());
				userVideo.current.srcObject = new MediaStream();
			});

		setUser({ userId: userInfo?._id, socketId: ws.id });
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (stream) {
			ws.emit('join room', { meetingId, user });

			ws.on('all users', (users) => {
				const peers = [];

				users.forEach((id) => {
					const peer = createPeer(id, user, stream);

					peers.push({ peerId: id, peer });
				});

				setPeers(peers);
			});

			ws.on('user joined', ({ signal, caller }) => {
				const peer = addPeer(signal, caller, stream);

				setPeers((prev) => [...prev, { peerId: caller.userId, peer }]);
			});

			ws.on('receiving returned signal', ({ signal, userId }) => {
				const item = peers.find((item) => item.peerId === userId);
				item.peer.signal(signal);
			});

			ws.on('refresh users', (users) => {
				const filteredUsers = users.filter((_user) => user.userId !== _user.userId);
				setPeers(filteredUsers);
			});

			return () => {
				ws.off('all users');
				ws.off('user joined');
				ws.off('refresh users');
				ws.off('receiving returned signal');
				console.log('ws.disconnect()');
				ws.disconnect();
				stream.getTracks().forEach((track) => track.stop());
			};
		}
		//eslint-disable-next-line
	}, [stream]);

	function createPeer(userToSignal, caller, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on('signal', (signal) => {
			ws.emit('sending signal', { userToSignal, caller, signal, meetingId });
		});

		return peer;
	}

	function addPeer(incomingSignal, caller, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});

		peer.on('signal', (signal) => {
			ws.emit('returning signal', { signal, caller });
		});

		peer.signal(incomingSignal);

		return peer;
	}

	console.log(peers);

	return (
		<Container>
			<StyledVideo muted ref={userVideo} autoPlay playsInline />
			<Box sx={{ display: 'flex' }}>
				{peers.map((item, index) => {
					return <Video key={index} peer={item.peer} />;
				})}
			</Box>
		</Container>
	);
};

export default MeetingScreen;
