import { Container, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';
import CreateGroupForm from '../components/forms/CreateGroupForm';
import CreateCourseForm from '../components/forms/CreateCourseForm';
import StudentsTable from '../components/tables/StudentsTable';

const AdminHomeScreen = () => {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

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
		</Container>
	);
};

export default AdminHomeScreen;
