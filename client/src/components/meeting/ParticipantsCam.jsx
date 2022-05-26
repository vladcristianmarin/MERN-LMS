import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { Button, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Iconify from '../Iconify';
import { ws } from '../../ws';

const Video = styled('video')(() => ({
	maxWidth: '100%',
	height: '20vh',
	transform: 'rotateY(180deg)',
	borderRadius: '3px',
	objectFit: 'fill',
}));

const ParticipantsCam = ({ stream, participant }) => {
	const ref = useRef();
	const theme = useTheme();
	const { userInfo } = useSelector((state) => state.userLogin);

	const [userMuted, setUserMuted] = useState(false);
	const [userHidden, setUserHidden] = useState(false);

	useEffect(() => {
		if (stream) {
			ref.current.srcObject = stream;
		}
	}, [stream]);

	useEffect(() => {
		ws.on('toggledOwnMic', (id) => {
			console.log(id);
			if (participant?._id === id) setUserMuted((prev) => !prev);
		});
		ws.on('toggledOwnCam', (id) => {
			console.log(id);
			if (participant?._id === id) setUserHidden((prev) => !prev);
		});

		return () => {
			ws.off('toggleOwnMic');
			ws.off('toggleOwnMic');
		};
		//eslint-disable-next-line
	}, []);

	const toggleMicParticipant = () => {
		const socketId = participant.socketId;
		ws.emit('toggleMic', socketId);
	};
	const toggleCamParticipant = () => {
		const socketId = participant.socketId;
		ws.emit('toggleCam', socketId);
	};

	const micButton = (
		<Tooltip title={userMuted ? 'Unmute' : 'Mute'}>
			<Button
				sx={{ color: '#fff' }}
				size='medium'
				onClick={() => {
					setUserMuted((prev) => !prev);
					toggleMicParticipant();
				}}
				startIcon={userMuted ? <Iconify icon='eva:mic-off-outline' /> : <Iconify icon='eva:mic-outline' />}>
				<Iconify
					sx={{ color: userMuted ? theme.palette.error.main : theme.palette.primary.main }}
					icon='carbon:dot-mark'
				/>
			</Button>
		</Tooltip>
	);

	const cameraButton = (
		<Tooltip title={userHidden ? 'Show Camera' : 'Hide Camera'}>
			<Button
				size='medium'
				sx={{ color: '#fff' }}
				onClick={() => {
					setUserHidden((prev) => !prev);
					toggleCamParticipant();
				}}
				startIcon={userHidden ? <Iconify icon='eva:video-off-outline' /> : <Iconify icon='eva:video-outline' />}>
				<Iconify
					sx={{ color: userHidden ? theme.palette.error.main : theme.palette.primary.main }}
					icon='carbon:dot-mark'
				/>
			</Button>
		</Tooltip>
	);

	return (
		<Paper sx={{ bgcolor: theme.palette.background.neutral, position: 'relative' }}>
			<Video playsInline autoPlay ref={ref} muted />
			<Typography
				sx={{ position: 'absolute', top: '5px', left: '5px', color: theme.palette.primary.contrastText }}
				variant='subtitle2'>
				{participant?.name}
			</Typography>
			{userInfo?.role === 'Teacher' && (
				<Stack direction='row' sx={{ position: 'absolute', bottom: '5px', left: 0 }}>
					{micButton}
					{cameraButton}
				</Stack>
			)}
			{userInfo?.role === 'Student' && (
				<Stack
					direction='row'
					gap='2px'
					sx={{ position: 'absolute', top: '5px', right: '5px', color: '#fff', fontSize: '1.2rem' }}>
					{userMuted ? <Iconify icon='eva:mic-off-outline' /> : <Iconify icon='eva:mic-outline' />}
					{userHidden ? <Iconify icon='eva:video-off-outline' /> : <Iconify icon='eva:video-outline' />}
				</Stack>
			)}
		</Paper>
	);
};

export default ParticipantsCam;
