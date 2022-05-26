import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, CircularProgress, Container, styled, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ws } from '../ws';
import Meeting from '../components/meeting/Meeting';
import { Peer } from 'peerjs';
import Toast from '../components/Toast';
import { Box } from '@mui/system';

const ErrorStyles = styled('div')(() => ({
	display: 'flex',
	minHeight: '100%',
	alignItems: 'center',
}));

const MeetingScreen = () => {
	const [myVideoStream, setMyVideoStream] = useState(null);
	const [screenStream, setScreenStream] = useState(null);

	const [peer, setPeer] = useState(null);

	const [participants, setParticipants] = useState([]);
	const [participantsStreams, setParticipantsStreams] = useState([]);
	const [participantsPeers, setParticipantsPeers] = useState([]);

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const [toast, setToast] = useState({
		show: false,
		severity: 'error',
		message: '',
	});

	const navigate = useNavigate();

	const { meetingId } = useParams();
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		const getPermissions = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				setMyVideoStream(stream);
			} catch (e) {
				setError('You must give permissions!');
				setLoading(false);
				console.error(e);
			}
		};
		getPermissions();
	}, []);

	const errorHandler = (error) => {
		if (error === null) {
			setLoading(false);
			setError(null);
			return;
		}
		setError(error);
		setLoading(false);
		if (myVideoStream) {
			const tracks = myVideoStream.getTracks();
			tracks.forEach((track) => track.stop());
		}
	};

	useEffect(() => {
		if (myVideoStream) {
			ws.emit('userJoinedMeeting', meetingId, userInfo, errorHandler);

			const peer = new Peer(userInfo?._id);
			setPeer(peer);

			peer.on('connection', (data) => console.log(data));

			peer.on('call', (call) => {
				setParticipants((prev) => [...prev, call]);
				call.answer(myVideoStream);
				call.on('stream', (participantVideoStream) => {
					setParticipantsStreams((prevStreams) => {
						if (prevStreams.find((stream) => stream.id === participantVideoStream.id)) {
							return prevStreams;
						}
						return [...prevStreams, participantVideoStream];
					});
				});
			});

			ws.on('userConnected', (user) => {
				setToast({ show: true, severity: 'success', message: `${user?.name} has joined the meeting` });
				const call = peer.call(user._id, myVideoStream);
				setParticipantsPeers((prev) => [...prev, call]);
				call.on('stream', (participantVideoStream) => {
					setParticipantsStreams((prevStreams) => {
						if (prevStreams.find((stream) => stream.id === participantVideoStream.id)) {
							return prevStreams;
						}
						return [...prevStreams, participantVideoStream];
					});
				});
			});

			let localParticipants = [];

			ws.on('setParticipants', (_participants) => {
				const filteredParticipants = _participants.filter(
					(p) => p._id !== userInfo?._id && !participants.find((_p) => _p._id === p._id)
				);
				setParticipants(filteredParticipants);
				localParticipants = filteredParticipants;
			});

			ws.on('userDisconnected', (user) => {
				setToast({ show: true, severity: 'error', message: `${user?.name} has left the meeting!` });
				const participantIndex = localParticipants.findIndex((p) => p._id === user._id);
				setParticipants((prevParticipants) => {
					const newParticipants = Array.from(prevParticipants);
					newParticipants.splice(participantIndex, 1);
					return newParticipants;
				});
				setParticipantsStreams((prevParticipantsStreams) => {
					const newParticipantsStreams = Array.from(prevParticipantsStreams);
					newParticipantsStreams.splice(participantIndex, 1);
					return newParticipantsStreams;
				});
			});

			ws.on('meetingEnded', () => {
				navigate('/', { replace: true });
			});

			return () => {
				peer.off('open');

				ws.off('userConnected');
				ws.off('userDisconnected');

				ws.emit('userLeftMeeting');

				const tracks = myVideoStream.getTracks();
				tracks.forEach((track) => track.stop());
			};
		}
		//eslint-disable-next-line
	}, [myVideoStream]);

	function startShareScreen(isSharing) {
		if (isSharing) {
			stopShareScreen();
		}
		navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
			setScreenStream(stream);
			let videoTrack = stream.getVideoTracks()[0];
			videoTrack.onended = () => {
				stopShareScreen();
			};
			if (peer && participantsPeers.length > 0) {
				participantsPeers.forEach((peer) => {
					const sender = peer.peerConnection.getSenders().find((s) => s.track.kind === videoTrack.kind);
					sender.replaceTrack(videoTrack);
				});
			}
		});
	}

	function stopShareScreen(isSharing) {
		if (!isSharing) return;
		let videoTrack = myVideoStream.getVideoTracks()[0];
		if (peer && participantsPeers.length > 0) {
			participantsPeers.forEach((peer) => {
				const sender = peer.peerConnection.getSenders().find((s) => s.track.kind === videoTrack.kind);
				sender.replaceTrack(videoTrack);
			});
		}
		screenStream.getTracks().forEach(function (track) {
			track.stop();
		});
	}

	return (
		<>
			{loading ? (
				<Box sx={{ maxWidth: 640, margin: 'auto', textAlign: 'center', mt: 'calc(100vh / 3)' }}>
					<CircularProgress size={64} thickness={2.4} />
				</Box>
			) : error ? (
				<ErrorStyles>
					<Container>
						<Box sx={{ maxWidth: 640, margin: 'auto', textAlign: 'center' }}>
							<Typography color='error' variant='h4' paragraph>
								{error}
							</Typography>
							<Typography sx={{ color: 'text.secondary' }}>Sorry, something went wrong!</Typography>
							<Box
								component='img'
								src='/images/illustration_error.png'
								alt='error'
								sx={{ height: 400, mx: 'auto', my: { xs: 2.5, sm: 5 } }}
							/>
							<Button to='/' size='large' variant='primary' component={Link}>
								&larr; Go to Home
							</Button>
						</Box>
					</Container>
				</ErrorStyles>
			) : (
				<>
					{myVideoStream && (
						<Meeting
							myVideoStream={myVideoStream}
							participants={participants}
							participantVideoStream={participantsStreams}
							participantsPeers={participantsPeers}
							startShareScreen={startShareScreen}
							stopShareScreen={stopShareScreen}
						/>
					)}

					<Toast
						show={toast?.show}
						timeout={1800}
						severity={toast?.severity}
						message={toast?.message}
						onClose={() => setToast(null)}
					/>
				</>
			)}
		</>
	);
};

export default MeetingScreen;
