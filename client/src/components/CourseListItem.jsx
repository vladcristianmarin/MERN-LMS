import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import {
	alpha,
	Card,
	ListItem,
	Stack,
	Link as MUILink,
	Typography,
	Avatar,
	Tooltip,
	Button,
	AvatarGroup,
} from '@mui/material';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CURRENT_URL } from '../constants/extra';
import Iconify from './Iconify';
import { ws } from '../ws';

const CourseListItem = ({ course }) => {
	const [inCall, setInCall] = useState(false);

	const theme = useTheme();
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		setInCall(course?.inCall);
	}, [course?.inCall]);

	const navigateToChat = (chatId) => {
		navigate(`/chat/${chatId}`, { replace: true });
	};

	const startMeeting = () => {
		navigate(`/meeting/${course?._id}`);
	};

	const joinMeeting = () => {
		navigate(`/meeting/${course?._id}`);
	};

	const endMeeting = () => {
		ws.emit('endMeeting', userInfo);
		setInCall(false);
	};

	return (
		<ListItem
			key={course._id}
			sx={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Card
				sx={{
					width: '95%',
					background: alpha(theme.palette.primary.lighter, 0.92),
					padding: theme.spacing(1, 2),
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
				}}>
				<Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'>
					<MUILink component={Link} variant='h5' to={`/courses/${course._id}`} underline='hover' color='text.primary'>
						{course.name}
					</MUILink>

					<Stack alignItems='flex-end'>
						<Typography variant='subtitle1'>
							{course.weekday.replace(/\w/, (firstLetter) => firstLetter.toUpperCase())}
						</Typography>
						<Typography variant='subtitle2' color='text.secondary'>
							{new Date(course.hour).toLocaleString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
								hour12: false,
							})}
						</Typography>
					</Stack>
				</Stack>

				<Typography variant='body2' color='text.secondary'>
					{course.description}
				</Typography>
				<Stack direction='row' justifyContent='space-between' alignItems='center'>
					<Stack direction='row' alignItems='center' gap={0.5}>
						{userInfo?.role === 'Student' && (
							<>
								<Avatar
									sx={{ bgcolor: theme.palette.primary.main }}
									src={`${CURRENT_URL}/${course.teacher?.avatar}`}
									alt={course.teacher.name}>
									{course.teacher.name[0]}
								</Avatar>
								<Stack>
									<Typography sx={{ lineHeight: 0.5 }} color='text.secondary' variant='body2'>
										{course.teacher.title}
									</Typography>
									<Typography variant='subtitle1'>{course.teacher.name}</Typography>
								</Stack>
							</>
						)}
						{userInfo?.role === 'Teacher' && (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<Typography variant='subtitle1'>Students</Typography>
								<AvatarGroup max={5}>
									{course.groups.map((group) =>
										group.students.map((stud) => {
											return (
												<Avatar
													sx={{ bgcolor: theme.palette.primary.main }}
													key={stud._id}
													src={`${CURRENT_URL}/${stud?.avatar}`}
													alt={stud.name}>
													{stud.name[0]}
												</Avatar>
											);
										})
									)}
								</AvatarGroup>
							</div>
						)}
					</Stack>
					<Box id='actions' sx={{ display: 'flex', gap: 0.5 }}>
						{inCall && (
							<Tooltip title='Join Call'>
								<Button
									variant='contained'
									color='secondary'
									startIcon={<Iconify icon='eva:video-outline' />}
									onClick={joinMeeting}>
									Join Meeting
								</Button>
							</Tooltip>
						)}
						{userInfo?.role === 'Teacher' &&
							(inCall ? (
								<Tooltip title='Close call'>
									<Button
										variant='contained'
										color='error'
										startIcon={<Iconify icon='eva:phone-off-outline' />}
										onClick={endMeeting}>
										End Meeting
									</Button>
								</Tooltip>
							) : (
								<Tooltip title='Call students'>
									<Button
										variant='contained'
										color='secondary'
										startIcon={<Iconify icon='eva:phone-call-outline' />}
										onClick={startMeeting}>
										Start Meeting
									</Button>
								</Tooltip>
							))}

						<Tooltip title='Course Chat'>
							<Button
								variant='contained'
								color='primary'
								startIcon={<Iconify icon='eva:message-circle-outline' />}
								onClick={navigateToChat.bind(this, course.chat)}>
								Join Chat
							</Button>
						</Tooltip>
					</Box>
				</Stack>
			</Card>
		</ListItem>
	);
};

export default CourseListItem;
