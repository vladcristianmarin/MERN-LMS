import { Button, Container, Divider } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listGroups } from '../actions/groupActions';
import GroupsTable from '../components/tables/GroupsTable';

const AdminGroupListScreen = () => {
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
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container maxWidth='xl'>
			<Button to='/' size='large' variant='primary' component={Link} sx={{ mb: 5 }}>
				&larr; Go Back
			</Button>
			<Divider sx={{ mb: 5 }} />
			<GroupsTable />
		</Container>
	);
};

export default AdminGroupListScreen;
