import { alpha, Badge, IconButton, Box, Typography } from '@mui/material';
import React, { useState, useRef } from 'react';
import Iconify from './Iconify';
import MenuPopover from './MenuPopover';

const Notifications = () => {
	const [isOpen, setIsOpen] = useState(false);
	const anchorRef = useRef(null);

	return (
		<>
			<IconButton
				size='large'
				color={isOpen ? 'primary' : 'default'}
				ref={anchorRef}
				sx={{
					...(isOpen && {
						bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
					}),
				}}
				onClick={() => setIsOpen((prev) => !prev.isOpen)}>
				<Badge badgeContent={2} color='error'>
					<Iconify icon='eva-bell-fill' />
				</Badge>
			</IconButton>
			<MenuPopover open={isOpen} onClose={() => setIsOpen(false)} anchorEl={anchorRef.current} sx={{ width: 360 }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						py: 2,
						px: 2.5,
					}}>
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant='subtitle1'>Notifications</Typography>
						<Typography variant='body1' sx={{ color: 'text.secondary' }}>
							You have 2 unread messages
						</Typography>
					</Box>
				</Box>
			</MenuPopover>
		</>
	);
};

export default Notifications;
