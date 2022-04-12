import { useTheme } from '@emotion/react';
import { Box, Container, Divider, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listGroups } from '../actions/groupActions';
import GroupsTable from '../components/tables/GroupsTable';

const AdminGroupListScreen = () => {
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
		dispatch(listGroups());
	}, [dispatch]);

	useEffect(handleFetchData, [handleFetchData]);

	return (
		<Container maxWidth='xl'>
			<Box sx={{ pb: 5, ml: 3 }}>
				<Typography variant='h4'>
					Groups <span style={{ color: theme.palette.primary.main }}>Dashboard 💻</span>
				</Typography>
			</Box>
			<Divider sx={{ mb: 5 }} />
			<GroupsTable />
		</Container>
	);
};

export default AdminGroupListScreen;
