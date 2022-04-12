import { Button, Container, Divider } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listCourses } from '../actions/courseActions';
import CoursesTable from '../components/tables/CoursesTable';

const AdminCourseListScreen = () => {
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
		dispatch(listCourses());
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container maxWidth='xl'>
			<Button to='/' size='large' variant='primary' component={Link} sx={{ mb: 5 }}>
				&larr; Go Back
			</Button>
			<Divider sx={{ mb: 5 }} />
			<CoursesTable />;
		</Container>
	);
};

export default AdminCourseListScreen;
