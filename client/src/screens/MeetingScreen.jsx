import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ws } from '../ws';
import { useSelector } from 'react-redux';

const StyledVideo = styled('video')(() => ({
	height: '40%',
	width: '50%',
	transform: 'rotateY(180deg)',
}));

const Video = ({ item }) => {
	const ref = useRef();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (item.src) {
			ref.current.srcObject = item.src;
		}
	}, [item]);

	const toggleCamera = () => {
		ws.emit('toggle remote cam', item.id);
	};

	const toggleMic = () => {
		ws.emit('toggle remote mic', item.id);
	};

	return (
		<Box>
			<StyledVideo playsInline autoPlay ref={ref} />
			{userInfo?.role === 'Teacher' && <Button onClick={toggleCamera}>Toggle User's Camera</Button>}
			{userInfo?.role === 'Teacher' && <Button onClick={toggleMic}>Toggle User's Mic</Button>}
		</Box>
	);
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

const MeetingScreen = () => {
	const peersRef = useRef([]);
	const tracksRef = useRef({});
	const [stream, setStream] = useState(null);
	const [screenTrack, setScreenTrack] = useState(null);
	const [otherUsers, setOtherUsers] = useState([]);
	const [senders, setSenders] = useState([]);

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
			.catch((_err) => {});
	}, []);

	useEffect(() => {
		if (stream) {
			ws.emit('user joined room', meetingId);

			ws.on('all other users', (otherUsers) => callOtherUsers(otherUsers, stream));

			ws.on('connection offer', (payload) => handleReceiveOffer(payload, stream));

			ws.on('connection answer', handleAnswer);

			ws.on('ice-candidate', handleReceiveIce);

			ws.on('user disconnected', (userId) => handleDisconnect(userId));

			ws.on('toggle cam', toggleCam);

			ws.on('toggle mic', toggleAudio);

			return () => {
				ws.off('all other users');
				ws.off('connection offer');
				ws.off('connection answer');
				ws.off('ice-candidate');
				ws.off('user disconnected');
				ws.off('toggle cam');
				ws.off('toggle mic');
				ws.disconnect();
				stream.getTracks().forEach((track) => track.stop());
			};
		}
		//eslint-disable-next-line
	}, [stream]);

	const handleNegotiationNeeded = async (peer, userIdToCall) => {
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);

		ws.emit('peer connection request', { sdp: peer.localDescription, userIdToCall });
	};

	const handleICECandidate = (e) => {
		if (e.candidate) {
			peersRef.current.forEach((peer) => ws.emit('ice-candidate', { target: peer.id, candidate: e.candidate }));
		}
	};

	const handleReceiveOffer = async ({ sdp, callerId }, stream) => {
		const peer = createPeer(callerId);
		// setPeers((prev) => [...prev, { id: callerId, peer }]);
		peersRef.current.push({ id: callerId, peer });
		const desc = new RTCSessionDescription(sdp);

		await peer.setRemoteDescription(desc);

		stream.getTracks().forEach((track) => {
			const sender = peer.addTrack(track, stream);
			setSenders((prev) => [...prev, sender]);
		});

		const answer = await peer.createAnswer();
		await peer.setLocalDescription(answer);

		ws.emit('connection answer', { userToAnswerTo: callerId, sdp: peer.localDescription });
	};

	const handleAnswer = ({ sdp, answererId }) => {
		const desc = new RTCSessionDescription(sdp);
		peersRef.current
			.find((peer) => peer.id === answererId)
			.peer.setRemoteDescription(desc)
			.catch((e) => console.error(e));
	};

	const handleReceiveIce = ({ candidate, from }) => {
		const incomingCandidate = new RTCIceCandidate(candidate);
		peersRef.current.find((peer) => peer.id === from).peer.addIceCandidate(incomingCandidate);
	};

	const handleTrack = (id, e) => {
		tracksRef.current.srcObject = e.streams[0];
		setOtherUsers((prev) => {
			const alreadyExisting = prev.find((user) => user.id === id);
			if (alreadyExisting) {
				alreadyExisting.src = tracksRef.current.srcObject;
				return prev;
			}
			return [...prev, { id, src: tracksRef.current.srcObject }];
		});
	};

	const handleDisconnect = (userId) => {
		peersRef.current = peersRef.current.filter((peer) => peer.id !== userId);
		setOtherUsers((prev) => prev.filter((otherUser) => otherUser.id !== userId));
	};

	const callOtherUsers = (otherUsers, stream) => {
		otherUsers.forEach((userIdToCall) => {
			const peer = createPeer(userIdToCall);
			peersRef.current.push({ id: userIdToCall, peer });
			stream.getTracks().forEach((track) => {
				const sender = peer.addTrack(track, stream);
				setSenders((prev) => [...prev, sender]);
			});
		});
	};

	const createPeer = (userIdToCall) => {
		const peer = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.stunprotocol.org' }],
		});
		peer.onnegotiationneeded = () => (userIdToCall ? handleNegotiationNeeded(peer, userIdToCall) : null);
		peer.onicecandidate = handleICECandidate;
		peer.ontrack = handleTrack.bind(this, userIdToCall);

		return peer;
	};

	const toggleCam = () => {
		const videoTrack = stream.getTracks().find((track) => track.kind === 'video');
		videoTrack.enabled = !videoTrack.enabled;
	};

	const toggleAudio = () => {
		const audioTrack = stream.getTracks().find((track) => track.kind === 'audio');
		audioTrack.enabled = !audioTrack.enabled;
		audioTrack.muted = !audioTrack.muted;
	};

	function shareScreen() {
		navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((screenStream) => {
			const screenTrack = screenStream.getTracks()[0];
			setScreenTrack(screenTrack);
			senders.find((sender) => sender.track.kind === 'video').replaceTrack(screenTrack);
			screenTrack.onended = function () {
				senders.find((sender) => sender.track.kind === 'video').replaceTrack(stream.getTracks()[1]);
			};
		});
	}

	function stopShareScreen() {
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((userStream) => {
				const videoTrack = userStream.getTracks()[1];
				senders.find((sender) => sender.track.kind === 'video').replaceTrack(videoTrack);
				screenTrack.active = false;
				screenTrack.enabled = false;
				screenTrack.stop();
				setScreenTrack(null);
			})
			.catch((e) => console.error(e));
	}

	return (
		<Container>
			<StyledVideo muted ref={userVideo} autoPlay playsInline />
			<Box sx={{ display: 'flex' }}>
				{otherUsers.map((item, index) => {
					return <Video key={index} item={item} />;
				})}
			</Box>
			<Button onClick={toggleCam}>Toggle Cam</Button>
			<Button onClick={toggleAudio}>Toggle Mic</Button>
			<Button onClick={shareScreen}>Share Screen</Button>
			<Button onClick={stopShareScreen}>Stop Share Screen</Button>
		</Container>
	);
};

export default MeetingScreen;
