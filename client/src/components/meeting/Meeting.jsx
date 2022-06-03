import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import {
	Alert,
	Button,
	Grid,
	IconButton,
	Pagination,
	PaginationItem,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
} from '@mui/material';
import ParticipantsCam from './ParticipantsCam';
import Iconify from '../Iconify';
import MainCam from './MainCam';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ws } from '../../ws';
import MeetingChat from './MeetingChat';
import MeetingParticipants from './MeetingParticipants';
import { Box } from '@mui/system';

const DATA_LIMIT = 5;

const Meeting = ({ myVideoStream, participants, participantVideoStream, startShareScreen, stopShareScreen }) => {
	const [count, setCount] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const [micMuted, setMicMuted] = useState(false);
	const [cameraHidden, setCameraHidden] = useState(false);

	const [isSharing, setIsSharing] = useState(false);

	const [meetingEnded, setMeetingEnded] = useState(false);

	const [selectedSide, setSelectedSide] = useState('chat');

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

	const selectedSideHandler = (e, side) => {
		setSelectedSide(side);
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
					ws.emit('toggleOwnMic', userInfo?._id);
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
					ws.emit('toggleOwnCam', userInfo?._id);
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
		<>
			<Tooltip title='If something is off, press this'>
				<IconButton
					sx={{ marginLeft: theme.spacing(1.5), marginBottom: theme.spacing(0.5) }}
					color='primary'
					size='medium'
					onClick={() => {
						//eslint-disable-next-line
						location.reload();
					}}>
					<Iconify icon='eva:refresh-outline' />
				</IconButton>
			</Tooltip>
			<Box
				sx={{
					px: theme.spacing(3),
					margin: '0 auto',
					display: 'grid',
					minHeight: '70vh',
					gridTemplateColumns: '0.6fr 0.35fr',
					gridAutoRows: 'minmax(min-content, max-content)',
				}}>
				<Box
					sx={{
						bgcolor: theme.palette.background.neutral,
						p: theme.spacing(0.5, 1),
						mr: theme.spacing(1.5),
						minHeight: '65vh',
						borderRadius: '7px',
						boxShadow: theme.customShadows.z1,
						display: 'flex !important',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}>
					{isSharing && (
						<Alert
							severity='info'
							variant='filled'
							sx={{ width: theme.spacing(45), boxShadow: theme.customShadows.z1, mb: theme.spacing(0.5) }}
							iconMapping={{ info: <Iconify icon='eva:cast-outline' /> }}>
							You are <strong>sharing</strong> your screen right now!
						</Alert>
					)}
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing(0.5) }}>
						<MainCam myVideoStream={myVideoStream} />
						{getPaginatedData().map((stream, index) => (
							<ParticipantsCam key={index} stream={stream} participant={participants[index * currentPage]} />
						))}
					</Box>

					<Box>
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
					</Box>
				</Box>
				<Box item xs={5}>
					<ToggleButtonGroup
						exclusive
						value={selectedSide}
						onChange={selectedSideHandler}
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							bgcolor: theme.palette.background.paper,
						}}>
						<ToggleButton sx={{ flex: '1', borderBottomLeftRadius: 0 }} color='primary' value='chat'>
							Chat
						</ToggleButton>
						<ToggleButton sx={{ flex: '1', borderBottomRightRadius: 0 }} color='primary' value='participants'>
							Participants
						</ToggleButton>
					</ToggleButtonGroup>
					{selectedSide === 'chat' && <MeetingChat />}
					{selectedSide === 'participants' && <MeetingParticipants participants={participants} />}
				</Box>
			</Box>
		</>
	);
};

export default Meeting;
