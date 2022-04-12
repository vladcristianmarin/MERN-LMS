import { Button, Container, Divider } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listStudents } from '../actions/studentActions';
import StudentsTable from '../components/tables/StudentsTable';

const AdminStudentListScreen = () => {
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
		dispatch(listStudents());
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container maxWidth='xl'>
			<Button to='/' size='large' variant='primary' component={Link} sx={{ mb: 5 }}>
				&larr; Go Back
			</Button>
			<Divider sx={{ mb: 5 }} />
			<StudentsTable />;
		</Container>
	);
};

export default AdminStudentListScreen;
