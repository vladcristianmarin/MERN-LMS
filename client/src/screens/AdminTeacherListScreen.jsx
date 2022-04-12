import { Button, Container, Divider } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listTeachers } from '../actions/teacherActions';
import TeachersTable from '../components/tables/TeachersTable';

const AdminTeacherListScreen = () => {
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
		dispatch(listTeachers());
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container maxWidth='xl'>
			<Button to='/' size='large' variant='primary' component={Link} sx={{ mb: 5 }}>
				&larr; Go Back
			</Button>
			<Divider sx={{ mb: 5 }} />
			<TeachersTable />;
		</Container>
	);
};

export default AdminTeacherListScreen;
