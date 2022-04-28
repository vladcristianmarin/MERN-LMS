import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCourses } from '../actions/teacherActions';
import CoursesList from '../components/CoursesList';

const TeacherCoursesScreen = () => {
	const dispatch = useDispatch();
	const { courses, loading, error } = useSelector((state) => state.teacherMyCourses);

	useEffect(() => {
		dispatch(getMyCourses());
	}, [dispatch]);

	console.log(courses);

	return loading ? (
		<Box
			sx={{
				margin: '0 auto',
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<CircularProgress />
		</Box>
	) : error ? (
		<Typography variant='h4' color='error' textAlign='center'>
			Something went wrong! <b>{error}</b>
		</Typography>
	) : (
		<CoursesList courses={courses} />
	);
};

export default TeacherCoursesScreen;
