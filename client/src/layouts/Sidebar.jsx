import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import ScrollBar from '../components/ScrollBar';

import { Link, useLocation } from 'react-router-dom';
import useResponsive from '../hooks/useResponsive';
import {
	Avatar,
	Box,
	DialogTitle,
	Drawer,
	IconButton,
	Link as MUILink,
	Typography,
} from '@mui/material';
import Navigation from './Navigation';
import navConfig from './SidebarNavConfig';
import Iconify from '../components/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { hideSidebar } from '../actions/sidebarActions';

const DRAWER_WIDTH = 280;

const Sidebar = ({ onCloseSidebar }) => {
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const { isOpen } = useSelector((state) => state.sidebar);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const isDesktop = useResponsive('up', 'lg');
	const isMobile = useResponsive('down', 'sm');

	const closeSidebarHandler = () => {
		dispatch(hideSidebar());
	};

	useEffect(() => {
		if (isOpen && isMobile) {
			dispatch(hideSidebar());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isMobile, dispatch]);

	const AccountStyle = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(2, 2.5),
		borderRadius: Number(theme.shape.borderRadius) * 1.5,
		backgroundColor: theme.palette.grey[500_12],
	}));

	const DialogTitleStyle = styled(DialogTitle)(() => ({
		position: 'absolute',
		right: 0,
		transform: 'translate(20%, 15%)',
	}));

	const content = (
		<ScrollBar
			sx={{
				height: 1,
				'& .simplebar-content': {
					height: 1,
					display: 'flex',
					flexDirection: 'column',
				},
			}}>
			<Box sx={{ px: 2.5, pt: 1.5, pb: 2.5, display: 'inline-flex' }}>
				<MUILink underline='none' to='/' component={Link}>
					<Typography variant='h2' color='primary'>
						WeKlass
					</Typography>
				</MUILink>
			</Box>

			<Box sx={{ mb: 5, mx: 2.5 }}>
				<MUILink underline='none' component={Link} to='#'>
					<AccountStyle>
						<Avatar
							src={userInfo?.avatar}
							alt={`${userInfo?.name} profile picture`}
							sx={{ bgcolor: 'primary.dark' }}>
							{userInfo?.name[0].toUpperCase()}
						</Avatar>
						<Box sx={{ ml: 2 }}>
							<Typography variant='subtitle1' color='text.primary'>
								{userInfo?.name}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{userInfo?.role}
							</Typography>
						</Box>
					</AccountStyle>
				</MUILink>
			</Box>

			<Typography sx={{ pl: 5 }} variant='subtitle2' color='grey[800]'>
				GENERAL
			</Typography>
			<Navigation navConfig={navConfig({ _id: 'asd', groupId: 'adsadas' })} />
		</ScrollBar>
	);

	// <RootStyle>
	// 	{!isDesktop && (
	// 		<Drawer
	// 			open={isOpen}
	// 			onClose={closeSidebarHandler}
	// 			PaperProps={{ sx: { width: DRAWER_WIDTH } }}>
	// 			{content}
	// 		</Drawer>
	// 	)}
	// 	{isDesktop && (
	// 		<Drawer
	// 			variant='persistent'
	// 			open={isOpen}
	// 			onClose={closeSidebarHandler}
	// 			PaperProps={{
	// 				sx: { width: DRAWER_WIDTH, bgcolor: 'Background.default' },
	// 			}}>
	// 			<DialogTitleStyle>
	// 				<IconButton
	// 					onClick={closeSidebarHandler}
	// 					sx={{ '&:hover': { transform: 'scale(1.07)' } }}>
	// 					<Iconify icon='eva:arrowhead-left-outline' />
	// 				</IconButton>
	// 			</DialogTitleStyle>
	// 			{content}
	// 		</Drawer>
	// 	)}
	// </RootStyle>

	return (
		<>
			{!isDesktop && (
				<Drawer
					open={isOpen}
					onClose={closeSidebarHandler}
					PaperProps={{ sx: { width: DRAWER_WIDTH } }}>
					{content}
				</Drawer>
			)}
			{isDesktop && (
				<Drawer
					variant='persistent'
					open={isOpen}
					onClose={closeSidebarHandler}
					PaperProps={{
						sx: { width: DRAWER_WIDTH, bgcolor: 'Background.default' },
					}}>
					<DialogTitleStyle>
						<IconButton
							onClick={closeSidebarHandler}
							sx={{ '&:hover': { transform: 'scale(1.07)' } }}>
							<Iconify icon='eva:arrowhead-left-outline' />
						</IconButton>
					</DialogTitleStyle>
					{content}
				</Drawer>
			)}
		</>
	);
};

export default Sidebar;
