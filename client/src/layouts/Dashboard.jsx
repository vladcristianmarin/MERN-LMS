import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import Header from './Header';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;
const DRAWER_WIDTH = 280;

const Dashboard = () => {
	const { isOpen } = useSelector((state) => state.sidebar);

	const RootStyle = styled('div')({
		display: 'flex',
		minHeight: '100%',
		overflow: 'hidden',
	});

	const MainStyle = styled('div')(({ theme }) => ({
		flexGrow: 1,
		overflow: 'auto',
		minHeight: '100%',
		paddingTop: APP_BAR_MOBILE + 24,
		paddingBottom: theme.spacing(10),
		[theme.breakpoints.down('sm')]: {
			margin: '0 auto',
		},
		[theme.breakpoints.up('lg')]: {
			paddingTop: APP_BAR_DESKTOP + 24,
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2),
			marginLeft: isOpen ? DRAWER_WIDTH : 0,
		},
	}));

	return (
		<RootStyle>
			<Header />
			<Sidebar />
			<MainStyle>
				<Outlet />
			</MainStyle>
		</RootStyle>
	);
};

export default Dashboard;
