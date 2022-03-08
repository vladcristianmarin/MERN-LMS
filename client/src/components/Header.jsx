import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import {
	AppBar,
	Toolbar,
	IconButton,
	Stack,
	Box,
	Typography,
} from '@mui/material';
import { alpha } from '@mui/material';
import Iconify from './Iconify';
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import AccountPopover from './AccountPopover';

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const Header = ({ onOpenSidebar }) => {
	const RootStyle = styled(AppBar)(({ theme }) => ({
		boxShadow: 'none',
		backdropFilter: 'blur(6px)',
		backgroundColor: alpha(theme.palette.background.default, 0.72),
		[theme.breakpoints.up('lg')]: {
			width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
		},
	}));

	const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
		minHeight: APPBAR_MOBILE,
		[theme.breakpoints.up('lg')]: {
			minHeight: APPBAR_DESKTOP,
			padding: theme.spacing(0, 5),
		},
	}));

	return (
		<RootStyle position='static'>
			<ToolbarStyle>
				<IconButton
					onClick={onOpenSidebar}
					color='primary'
					sx={{
						mr: 1,
						display: { lg: 'none' },
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
		</RootStyle>
	);
};

Header.propTypes = {
	onOpenSidebar: PropTypes.func,
};

export default Header;
