import { alpha, Avatar, Box, Divider, IconButton, MenuItem, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Iconify from './Iconify';
import MenuPopover from './MenuPopover';
import { logout } from '../actions/userActions';

const AccountPopover = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const anchorRef = useRef(null);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const MENU_OPTIONS = [
		{
			label: 'Home',
			icon: 'eva:home-outline',
			linkTo: '/',
			onClick() {
				setIsOpen(false);
			},
		},
		{
			label: 'Profile',
			icon: 'eva:person-outline',
			linkTo: '/',
			onClick() {
				setIsOpen(false);
			},
		},
		{
			label: 'Settings',
			icon: 'eva:settings-2-outline',
			linkTo: '/',
			onClick() {
				setIsOpen(false);
			},
		},
		{
			label: 'Logout',
			icon: 'eva:log-out-outline',
			linkTo: '/',
			onClick() {
				console.log('logout');
				navigate('/login', { replace: true });
				dispatch(logout());
			},
		},
	];

	return (
		<>
			<IconButton
				ref={anchorRef}
				sx={{
					padding: 0,
					width: 44,
					height: 44,
					...(isOpen && {
						'&:before': {
							zIndex: 1,
							content: "''",
							width: '100%',
							height: '100%',
							borderRadius: '50%',
							position: 'absolute',
							bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
						},
					}),
				}}
				onClick={() => setIsOpen((prev) => !prev.isOpen)}>
				<Avatar src={userInfo?.avatar} alt={`${userInfo?.name} profile picture`} sx={{ bgcolor: 'primary.dark' }}>
					{userInfo?.name[0].toUpperCase()}
				</Avatar>
			</IconButton>
			<MenuPopover open={isOpen} onClose={() => setIsOpen(false)} anchorEl={anchorRef.current}>
				<Box sx={{ my: 1.5, px: 2.5 }}>
					<Typography variant='subtitle1' noWrap>
						{userInfo?.name}
					</Typography>
					<Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
						{userInfo?.email}
					</Typography>
				</Box>

				<Divider sx={{ my: 1 }} />

				{MENU_OPTIONS.map((option, i) => (
					<MenuItem key={i} to={option.linkTo} component={Link} onClick={option.onClick} sx={{ py: 1, px: 2.5 }}>
						<Iconify icon={option.icon} sx={{ mr: 2, width: 25, height: 25 }} />
						<Typography variant='body1'>{option.label}</Typography>
					</MenuItem>
				))}
			</MenuPopover>
		</>
	);
};

export default AccountPopover;
