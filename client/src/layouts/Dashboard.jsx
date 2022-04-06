import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Box, CssBaseline } from '@mui/material';

import Footer from './Footer';
import AppBar from './AppBar';
import DrawerMenu from './DrawerMenu';
import { StyledMain } from './styles/MainPageStyles';

const Dashboard = () => {
	const { isOpen } = useSelector((state) => state.sidebar);

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
			<CssBaseline />
			<AppBar />
			<DrawerMenu />
			<StyledMain open={isOpen}>
				<Outlet />
			</StyledMain>
			<Footer />
		</Box>
	);
};

export default Dashboard;
