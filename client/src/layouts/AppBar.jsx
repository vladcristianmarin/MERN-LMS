import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Stack, Toolbar, Box } from '@mui/material';

import AccountPopover from '../components/AccountPopover';
import Iconify from '../components/Iconify';
import Notifications from '../components/Notifications';
import SearchBar from '../components/SearchBar';
import { StyledAppBar } from './styles/AppBarStyles';

import { showSidebar } from '../actions/sidebarActions';

const AppBar = () => {
	const dispatch = useDispatch();

	const { isOpen } = useSelector((state) => state.sidebar);

	const handleDrawerOpen = () => {
		dispatch(showSidebar());
	};

	return (
		<StyledAppBar>
			<Toolbar>
				<IconButton
					color='inherit'
					aria-label='open drawer'
					onClick={handleDrawerOpen}
					edge='start'
					sx={{ mr: 2, ...(isOpen && { display: 'none' }) }}>
					<Iconify icon='eva:menu-outline' />
				</IconButton>
				<SearchBar />
				<Box sx={{ flexGrow: 1 }} />
				<Stack direction='row' alignItems='center' spacing={{ xs: 0.5, sm: 1.5 }}>
					<Notifications />
					<AccountPopover />
				</Stack>
			</Toolbar>
		</StyledAppBar>
	);
};

export default AppBar;
