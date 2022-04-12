import { Container, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateGroupForm from '../components/forms/CreateGroupForm';
import CreateCourseForm from '../components/forms/CreateCourseForm';
import StudentsTable from '../components/tables/StudentsTable';
import { useNavigate } from 'react-router-dom';
import TeachersTable from '../components/tables/TeachersTable';
import GroupsTable from '../components/tables/GroupsTable';
import { listGroups } from '../actions/groupActions';
import { listTeachers } from '../actions/teacherActions';
import { listStudents } from '../actions/studentActions';
import { listCourses } from '../actions/courseActions';
import CoursesTable from '../components/tables/CoursesTable';

const AdminHomeScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	const handleFetchData = useCallback(() => {
		dispatch(listGroups());
		dispatch(listCourses());
		dispatch(listTeachers());
		dispatch(listStudents());
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container>
			<Box sx={{ pb: 5 }}>
				<Typography variant='h4'>{`Hi 👋! Welcome to Dashboard, ${userInfo?.name}.`}</Typography>
			</Box>

			<Divider sx={{ mb: 5 }} />

			<Grid spacing={6} container alignItems='center' justifyContent='center'>
				<Grid item sm={12} md={6}>
					<CreateGroupForm />
				</Grid>
				<Grid item sm={12} md={6}>
					<CreateCourseForm />
				</Grid>
			</Grid>

			<Divider sx={{ m: 5 }} />

			<StudentsTable />
			<TeachersTable />
			<GroupsTable />
			<CoursesTable />
		</Container>
	);
};

export default AdminHomeScreen;
