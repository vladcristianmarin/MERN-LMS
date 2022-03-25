import { Container, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CreateGroupForm from '../components/forms/CreateGroupForm';
import CreateCourseForm from '../components/forms/CreateCourseForm';
import StudentsTable from '../components/tables/StudentsTable';
import { useNavigate } from 'react-router-dom';
import TeachersTable from '../components/tables/TeachersTable';

const AdminHomeScreen = () => {
	const navigate = useNavigate();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	return (
		<Container maxWidth='xl'>
			<Box sx={{ pb: 5 }}>
				<Typography variant='h4'>{`Hi, Welcome back ${userInfo?.name}!`}</Typography>
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

			<Divider sx={{ mb: 5 }} />

			<StudentsTable />
			<TeachersTable />
		</Container>
	);
};

export default AdminHomeScreen;
