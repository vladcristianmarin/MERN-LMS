import { useTheme } from '@emotion/react';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { CURRENT_URL } from '../../constants/extra';
import { ws } from '../../ws';
import Iconify from '../Iconify';

const ParticipantListItem = ({ participant }) => {
	const theme = useTheme();

	const [userMuted, setUserMuted] = useState(participant?.isMuted || false);
	const [userHidden, setUserHidden] = useState(participant?.isHidden || false);

	useEffect(() => {
		ws.on('updateParticipant', (user) => {
			if (user._id === participant._id) {
				setUserHidden(user.isHidden);
				setUserMuted(user.isMuted);
			}
		});

		return () => {
			ws.off('updateParticipant');
		};
		// eslint-disable-next-line
	}, []);

	const micIcon = (
		<Box sx={{ display: 'flex', alignItems: 'center', fontSize: theme.typography.h3.fontSize }}>
			{userMuted ? <Iconify icon='eva:mic-off-outline' /> : <Iconify icon='eva:mic-outline' />}
			<Iconify
				sx={{ color: userMuted ? theme.palette.error.main : theme.palette.primary.main }}
				icon='carbon:dot-mark'
			/>
		</Box>
	);

	const camIcon = (
		<Box sx={{ display: 'flex', alignItems: 'center', fontSize: theme.typography.h3.fontSize }}>
			{userHidden ? <Iconify icon='eva:video-off-outline' /> : <Iconify icon='eva:video-outline' />}
			<Iconify
				sx={{ color: userHidden ? theme.palette.error.main : theme.palette.primary.main }}
				icon='carbon:dot-mark'
			/>
		</Box>
	);

	return (
		<ListItem key={participant._id}>
			<ListItemAvatar>
				<Avatar
					alt={`${participant?.name} profile picture`}
					src={`${CURRENT_URL}/${participant?.avatar}`}
					sx={{ bgcolor: 'primary.dark' }}>
					{participant?.name?.toUpperCase()}
				</Avatar>
			</ListItemAvatar>
			<ListItemText primary={participant?.name} secondary={participant?.role} />
			{micIcon}
			{camIcon}
		</ListItem>
	);
};

export default ParticipantListItem;
