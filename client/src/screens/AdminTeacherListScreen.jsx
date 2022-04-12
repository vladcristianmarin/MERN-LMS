import { useTheme } from '@emotion/react';
import { Box, Container, Divider, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listTeachers } from '../actions/teacherActions';
import TeachersTable from '../components/tables/TeachersTable';

const AdminTeacherListScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = useTheme();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	const handleFetchData = useCallback(() => {
		dispatch(listTeachers());
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container maxWidth='xl'>
			<Box sx={{ pb: 5, ml: 3 }}>
				<Typography variant='h4'>
					Teachers <span style={{ color: theme.palette.primary.main }}>Dashboard 💻</span>
				</Typography>
			</Box>
			<Divider sx={{ mb: 5 }} />
			<TeachersTable />;
		</Container>
	);
};

export default AdminTeacherListScreen;
