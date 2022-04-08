import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar, Divider, IconButton, Link as MUILink, Typography } from '@mui/material';

import Navigation from './Navigation';
import Iconify from '../components/Iconify';
import { StyledDrawer, StyledDrawerAccount, StyledDrawerHeader } from './styles/DrawerStyles';
import { Box } from '@mui/system';

import navConfig from './utils/SidebarNavConfig';
import { hideSidebar } from '../actions/sidebarActions';

const DrawerMenu = () => {
	const dispatch = useDispatch();
	const { isOpen } = useSelector((state) => state.sidebar);
	const { userInfo } = useSelector((state) => state.userLogin);

	const handleDrawerClose = () => {
		dispatch(hideSidebar());
	};

	return (
		<StyledDrawer variant='persistent' anchor='left' open={isOpen}>
			<StyledDrawerHeader>
				<MUILink underline='none' to='/' component={Link}>
					<Typography sx={{ ml: 2 }} variant='h3' color='primary'>
						WeKlass
					</Typography>
				</MUILink>
				<IconButton onClick={handleDrawerClose}>
					<Iconify icon='eva:arrowhead-left-outline' />
				</IconButton>
			</StyledDrawerHeader>
			<Divider />
			<Box sx={{ mb: 5, mx: 2.5 }}>
				<MUILink underline='none' component={Link} to='#'>
					<StyledDrawerAccount>
						<Avatar src={userInfo?.avatar} alt={`${userInfo?.name} profile picture`} sx={{ bgcolor: 'primary.dark' }}>
							{userInfo?.name[0].toUpperCase()}
						</Avatar>
						<Box sx={{ ml: 2 }}>
							<Typography variant='subtitle1' color='text.primary'>
								{userInfo?.name}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{userInfo?.isAdmin ? 'Admin' : userInfo?.role}
							</Typography>
						</Box>
					</StyledDrawerAccount>
				</MUILink>
			</Box>

			<Typography sx={{ pl: 5 }} variant='subtitle2' color='grey[800]'>
				GENERAL
			</Typography>
			<Navigation navConfig={navConfig({ _id: 'asd', groupId: 'adsadas' })} />
		</StyledDrawer>
	);
};

export default DrawerMenu;
