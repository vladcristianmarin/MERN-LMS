import React from 'react';
import { Card, Box, CardHeader } from '@mui/material';
import { useTheme } from '@emotion/react';
import Chat from './Chat';

const ChatBox = ({ selectedChat }) => {
	const theme = useTheme();
	return (
		<Card
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				padding: theme.spacing(0, 2, 2, 2),
				bgcolor: theme.palette.background.paper,
				width: '100%',
			}}>
			<CardHeader sx={{ alignSelf: 'flex-start' }} title={selectedChat?.chatName} />
			<Chat />
		</Card>
	);
};

export default ChatBox;
