import { useTheme } from '@emotion/react';
import { Box, List } from '@mui/material';
import React from 'react';
import ParticipantListItem from './ParticipantListItem';

const MeetingParticipants = ({ participants }) => {
	const theme = useTheme();

	return (
		<>
			<List
				sx={{
					width: '100%',
					height: '70vh',
					boxShadow: theme.customShadows.z1,
					borderRadius: '0 0 7px 7px',
					bgcolor: theme.palette.background.paper,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					px: theme.spacing(2.5),
					overflow: 'auto',
				}}>
				{participants.map((participant) => {
					if (participant.name) {
						return <ParticipantListItem key={participant._id} participant={participant} />;
					}
					return null;
				})}
				<Box
					component='img'
					src='/images/illustration_online_teaching.png'
					alt='people'
					sx={{ height: 'auto', mx: 'auto', my: { xs: 2.5, sm: 5 } }}
				/>
			</List>
		</>
	);
};

export default MeetingParticipants;
