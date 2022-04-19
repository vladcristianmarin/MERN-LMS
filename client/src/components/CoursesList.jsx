import React from 'react';
import { useTheme } from '@emotion/react';
import {
	alpha,
	Avatar,
	Card,
	IconButton,
	List,
	ListItem,
	Stack,
	Tooltip,
	Typography,
	Link as MUILink,
	Button,
} from '@mui/material';
import Iconify from './Iconify';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

const CoursesList = ({ courses }) => {
	const theme = useTheme();

	return (
		<List sx={{ overflow: 'auto' }}>
			{courses?.map((course) => (
				<ListItem key={course._id}>
					<Card
						sx={{
							width: '100%',
							background: alpha(theme.palette.primary.lighter, 0.92),
							padding: theme.spacing(1, 2),
							display: 'flex',
							flexDirection: 'column',
							gap: 1,
						}}>
						<Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'>
							<MUILink component={Link} variant='h5' to='#' underline='hover' color='text.primary'>
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
								<Avatar
									sx={{ bgcolor: theme.palette.primary.main }}
									src={course.teacher.avatar}
									alt={course.teacher.name}>
									{course.teacher.name[0]}
								</Avatar>
								<Stack>
									<Typography sx={{ lineHeight: 0.5 }} color='text.secondary' variant='body2'>
										{course.teacher.title}
									</Typography>
									<Typography variant='subtitle1'>{course.teacher.name}</Typography>
								</Stack>
							</Stack>
							<Box id='actions' sx={{ display: 'flex', gap: 0.5 }}>
								{course.inCall && (
									<Tooltip title='Join Call'>
										<Button variant='contained' color='secondary' startIcon={<Iconify icon='eva:phone-outline' />}>
											JOIN
										</Button>
									</Tooltip>
								)}
								<Tooltip title='Course Chat'>
									<Button variant='contained' color='primary' startIcon={<Iconify icon='eva:message-circle-outline' />}>
										CHAT
									</Button>
								</Tooltip>
							</Box>
						</Stack>
					</Card>
				</ListItem>
			))}
		</List>
	);
};

export default CoursesList;
