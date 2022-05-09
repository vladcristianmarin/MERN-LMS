import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCourse } from '../actions/courseActions';
import CreateResourceForm from '../components/forms/CreateResourceForm';

import { Avatar, Box, Card, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { CURRENT_URL } from '../constants/extra';

const CourseResourcesScreen = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const theme = useTheme();
	const { userInfo } = useSelector((state) => state.userLogin);
	const { loading: fetchCourseLoading, error: fetchCourseError, course } = useSelector((state) => state.courseFetch);

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	useEffect(() => {
		const courseId = location.pathname.replace('/courses/', '');
		dispatch(fetchCourse(courseId));
	}, [dispatch, location]);

	console.log(course);

	return (
		<Box sx={{ display: 'flex' }}>
			{fetchCourseLoading ? (
				<CircularProgress sx={{ alignSelf: 'center', justifySelf: 'center' }} />
			) : fetchCourseError ? (
				<Typography variant='h4' color='error'>
					Something went wrong! Try to refresh te page!
				</Typography>
			) : (
				<Box>
					<Stack direction='row' gap={theme.spacing(2)}>
						<Typography variant='h3'>{course?.name}</Typography>
						<Card sx={{ display: 'inline-block', padding: theme.spacing(1) }}>
							<Stack direction='row' alignItems='center' gap={0.5}>
								<Avatar
									variant='rounded'
									sx={{ bgcolor: theme.palette.primary.main }}
									src={`${CURRENT_URL}/${course?.teacher?.avatar}`}
									alt={course?.teacher.name}>
									{course?.teacher.name[0]}
								</Avatar>
								<Stack>
									<Typography sx={{ lineHeight: 0.5 }} color='text.secondary' variant='body2'>
										{course?.teacher.title}
									</Typography>
									<Typography variant='body1'>{course?.teacher.name}</Typography>
								</Stack>
							</Stack>
						</Card>
					</Stack>
					<Typography sx={{ mt: theme.spacing(0.5) }} variant='body1' color='text.secondary'>
						{course?.description} 😄
					</Typography>

					<Divider sx={{ my: theme.spacing(2.5) }} />

					{userInfo?.role === 'Teacher' && <CreateResourceForm />}
				</Box>
			)}
		</Box>
	);
};

export default CourseResourcesScreen;
