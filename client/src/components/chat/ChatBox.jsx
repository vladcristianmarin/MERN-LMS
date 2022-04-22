import React, { useEffect } from 'react';
import { Card, CardHeader } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from './Chat';
import { changeSelectedChat, getChatById } from '../../actions/chatActions';
import { useLocation } from 'react-router-dom';

const ChatBox = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const theme = useTheme();

	const { chat } = useSelector((state) => state.chatInfo);
	const { selectedChat } = useSelector((state) => state.selectedChat);

	useEffect(() => {
		const chatId = location.pathname.replace('/chat/', '');
		dispatch(getChatById(chatId));
	}, [location, dispatch]);

	useEffect(() => {
		dispatch(changeSelectedChat(chat));
	}, [dispatch, chat]);

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
