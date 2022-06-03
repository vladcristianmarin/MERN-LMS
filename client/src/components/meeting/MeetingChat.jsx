import { useTheme } from '@emotion/react';
import { CardHeader } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import ScrollableChat from '../chat/ScrollableChat';
import Iconify from '../Iconify';
import MeetingChatWritingField from './MeetingChatWritingField';
import { ws } from '../../ws';
import { useSelector } from 'react-redux';

const MeetingChat = () => {
	const [messages, setMessages] = useState([]);

	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		ws.emit('fetchMessages');

		ws.on('receiveMessage', (message) => {
			setMessages((prev) => [...prev, message]);
		});

		ws.on('listMessages', (messages) => {
			console.log(messages);
			setMessages(messages);
		});

		return () => {
			ws.off('receiveMessage');
		};
	}, []);

	const sendMessageHandler = (message) => {
		ws.emit('message', { sender: userInfo, content: message, createdAt: new Date() });
	};

	const theme = useTheme();
	return (
		<Box
			sx={{
				display: 'flex',
				flex: 1,
				alignItems: 'center',
				flexDirection: 'column',
				bgcolor: theme.palette.background.paper,
				width: '100%',
				height: '70vh',
				boxShadow: theme.customShadows.z1,
				borderRadius: '0 0 7px 7px',
			}}>
			<CardHeader
				sx={{ alignSelf: 'flex-start' }}
				title={'Chat'}
				avatar={<Iconify sx={{ fontSize: '1.4rem' }} icon='eva:message-square-outline' />}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					padding: theme.spacing(2),
					overflowY: 'hidden',
					height: '100%',
					width: '100%',
					borderRadius: '16px',
				}}>
				<Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
					<ScrollableChat messages={messages} isTyping={false} typingClient={null} />
				</Box>
				<MeetingChatWritingField sendMessage={sendMessageHandler} />
			</Box>
		</Box>
	);
};

export default MeetingChat;
