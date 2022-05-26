import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { Button, Grid, Pagination, PaginationItem, Stack, Tooltip } from '@mui/material';
import ParticipantsCam from './ParticipantsCam';
import Iconify from '../Iconify';
import MainCam from './MainCam';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ws } from '../../ws';

const DATA_LIMIT = 4;

const Meeting = ({ myVideoStream, participants, participantVideoStream, startShareScreen, stopShareScreen }) => {
	const [count, setCount] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const [micMuted, setMicMuted] = useState(false);
	const [cameraHidden, setCameraHidden] = useState(false);

	const [isSharing, setIsSharing] = useState(false);

	const [meetingEnded, setMeetingEnded] = useState(false);

	const theme = useTheme();
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		const count = Math.round(participantVideoStream.length / DATA_LIMIT);
		setCount(count);
	}, [participantVideoStream]);

	useEffect(() => {
		ws.on('toggleMic', toggleMic);
		ws.on('toggleCam', toggleCam);

		return () => {
			ws.off('toggleMic');
			ws.off('toggleCam');
		};
	});

	const handlePageChange = (_e, value) => {
		setCurrentPage(value);
	};

	const getPaginatedData = () => {
		const startIndex = currentPage * DATA_LIMIT - DATA_LIMIT;
		const endIndex = startIndex + DATA_LIMIT;
		return participantVideoStream.slice(startIndex, endIndex);
	};

	const endMeeting = () => {
		ws.emit('endMeeting', userInfo);
		setMeetingEnded(true);
	};

	const leaveMeeting = () => {
		navigate('/', { replace: true });
	};

	const toggleMic = () => {
		const enabled = myVideoStream.getAudioTracks()[0].enabled;
		if (enabled) {
			myVideoStream.getAudioTracks()[0].enabled = false;
		} else {
			myVideoStream.getAudioTracks()[0].enabled = true;
		}
		setMicMuted((prev) => !prev);
	};

	const toggleCam = () => {
		let enabled = myVideoStream.getVideoTracks()[0].enabled;
		if (enabled) {
			myVideoStream.getVideoTracks()[0].enabled = false;
		} else {
			myVideoStream.getVideoTracks()[0].enabled = true;
		}
		console.log(setCameraHidden);
		setCameraHidden((prev) => !prev);
	};

	const previous = () => <Iconify sx={{ width: '20px', height: '20px' }} icon='eva:arrow-left-outline' />;

	const next = () => <Iconify sx={{ width: '20px', height: '20px' }} icon='eva:arrow-right-outline' />;

	const micButton = (
		<Tooltip title={micMuted ? 'Unmute' : 'Mute'}>
			<Button
				size='large'
				color='inherit'
				onClick={() => {
					toggleMic();
					ws.emit('toggledOwnMic', userInfo?._id);
				}}
				startIcon={micMuted ? <Iconify icon='eva:mic-off-outline' /> : <Iconify icon='eva:mic-outline' />}>
				<Iconify
					sx={{ color: micMuted ? theme.palette.error.main : theme.palette.primary.main }}
					icon='carbon:dot-mark'
				/>
			</Button>
		</Tooltip>
	);

	const cameraButton = (
		<Tooltip title={cameraHidden ? 'Show Camera' : 'Hide Camera'}>
			<Button
				size='large'
				color='inherit'
				onClick={() => {
					toggleCam();
					ws.emit('toggledOwnCam', userInfo?._id);
				}}
				startIcon={cameraHidden ? <Iconify icon='eva:video-off-outline' /> : <Iconify icon='eva:video-outline' />}>
				<Iconify
					sx={{ color: cameraHidden ? theme.palette.error.main : theme.palette.primary.main }}
					icon='carbon:dot-mark'
				/>
			</Button>
		</Tooltip>
	);

	const shareButton = (
		<Tooltip title={isSharing ? 'Stop Sharing' : 'Start Sharing'}>
			<Button
				size='large'
				color={isSharing ? 'primary' : 'inherit'}
				onClick={() => {
					setIsSharing((prev) => !prev);
					isSharing ? stopShareScreen(isSharing) : startShareScreen(isSharing);
				}}
				startIcon={<Iconify icon='eva:cast-outline' />}
			/>
		</Tooltip>
	);

	const endLeaveButton = (
		<Button
			size='medium'
			variant='contained'
			color='error'
			startIcon={<Iconify icon='eva:phone-off-outline' />}
			onClick={userInfo?.role === 'Teacher' ? endMeeting : leaveMeeting}>
			{userInfo?.role === 'Teacher' ? 'End Meeting' : 'Leave Meeting'}
		</Button>
	);

	const goHomeButton = (
		<Button
			size='medium'
			variant='contained'
			color='secondary'
			startIcon={<Iconify icon='eva:arrow-back-outline' />}
			onClick={() => {
				navigate('/', { replace: true });
			}}>
			Go to Home
		</Button>
	);

	return (
		<Grid maxWidth='xl' container spacing={1.5} sx={{ px: theme.spacing(3) }}>
			<Grid
				item
				xs={7}
				sx={{
					bgcolor: theme.palette.background.neutral,
					p: theme.spacing(0.5, 1),
					borderRadius: '7px',
					boxShadow: theme.customShadows.z1,
				}}>
				<Grid item xs={12}>
					<MainCam myVideoStream={myVideoStream} user={userInfo} />
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
					{getPaginatedData().map((stream, index) => (
						<ParticipantsCam key={index} stream={stream} participant={participants[index]} />
					))}
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Pagination
						shape='rounded'
						size='large'
						count={count}
						page={currentPage}
						onChange={handlePageChange}
						sx={{ mt: theme.spacing(1) }}
						renderItem={(item) => (
							<PaginationItem
								components={{
									previous,
									next,
								}}
								{...item}
							/>
						)}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						bgcolor: theme.palette.background.paper,
						mx: theme.spacing(8),
						p: theme.spacing(1),
						borderRadius: '7px',
						boxShadow: theme.customShadows.z1,
						mt: theme.spacing(1),
					}}>
					<Stack gap={2} direction='row'>
						{micButton}
						{cameraButton}
						{shareButton}
					</Stack>
					{meetingEnded ? goHomeButton : endLeaveButton}
				</Grid>
			</Grid>
			<Grid item xs={5}></Grid>
		</Grid>
	);
};

export default Meeting;
