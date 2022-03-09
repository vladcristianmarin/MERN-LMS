import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import {
	AppBar,
	Toolbar,
	IconButton,
	Stack,
	Box,
	Divider,
} from '@mui/material';
import { alpha } from '@mui/material';
import Iconify from '../components/Iconify';
import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';
import AccountPopover from '../components/AccountPopover';
import { showSidebar } from '../actions/sidebarActions';

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const Header = () => {
	const dispatch = useDispatch();
	const { isOpen } = useSelector((state) => state.sidebar);

	const RootStyle = styled(AppBar)(({ theme }) => ({
		zIndex: 1100,
		top: 0,
		right: 0,
		left: 'auto',
		boxShadow: 'none',
		backdropFilter: 'blur(6px)',
		backgroundColor: alpha(theme.palette.background.default, 0.72),
		[theme.breakpoints.up('lg')]: isOpen
			? {
					width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
			  }
			: {},
	}));

	const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
		minHeight: APPBAR_MOBILE,
		[theme.breakpoints.up('lg')]: {
			minHeight: APPBAR_DESKTOP,
			padding: theme.spacing(0, 5, 0, 2.5),
		},
	}));

	const openSidebarHandler = () => {
		dispatch(showSidebar());
	};

	return (
		<RootStyle position='fixed'>
			<ToolbarStyle>
				<IconButton
					onClick={openSidebarHandler}
					color='primary'
					sx={{
						mr: 1,
						display: { lg: isOpen ? 'none' : '' },
					}}>
					<Iconify icon='eva:menu-2-fill' />
				</IconButton>
				<SearchBar />
				<Box sx={{ flexGrow: 1 }} />
				<Stack
					direction='row'
					alignItems='center'
					spacing={{ xs: 0.5, sm: 1.5 }}>
					<Notifications />
					<AccountPopover />
				</Stack>
			</ToolbarStyle>
			<Divider />
		</RootStyle>
	);
};

export default Header;
