import React, { useEffect } from 'react';
import { Box, Card, Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCourses } from '../actions/studentActions';
import CoursesList from '../components/CoursesList';
import { useTheme } from '@emotion/react';

const StudentCoursesScreen = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { courses } = useSelector((state) => state.studentMyCourses);
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		dispatch(getMyCourses());
	}, [dispatch]);

	return (
		<main
			style={{
				backgroundImage: "url('/images/illustration_my_courses_bck.png')",
				backgroundColor: theme.palette.background.paper,
				backgroundSize: 'cover',
				borderRadius: '16px',
				padding: theme.spacing(1),
			}}>
			<Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', gap: 0.5, pb: 5 }}>
				<Typography variant='h3'>{userInfo?.name}'s</Typography>
				<Typography variant='h3' sx={{ fontWeight: (theme) => theme.typography.fontWeightLight }}>
					Courses 📚
				</Typography>
			</Box>
			<Container maxWidth='xl'>
				<CoursesList courses={courses} />
			</Container>
		</main>
	);
};

export default StudentCoursesScreen;
