import React, { useEffect } from 'react';
import { Card, CircularProgress, List, ListItem, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedChat, listChats } from '../../actions/chatActions';
import { useNavigate } from 'react-router-dom';

const ChatsList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { selectedChat } = useSelector((state) => state.selectedChat);
	const chatList = useSelector((state) => state.chatList);
	const { error: chatListError, loading: chatListLoading, chats } = chatList;

	useEffect(() => {
		dispatch(listChats());
	}, [dispatch]);

	const changeChatHandler = (chat) => {
		dispatch(changeSelectedChat(chat));
		navigate(`/chat/${chat._id}`, { replace: true });
	};

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: theme.spacing(2),
				background: theme.palette.background.paper,
				width: '100%',
			}}>
			<Typography variant='h4'>My Chats</Typography>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					padding: theme.spacing(2),
					bgcolor: theme.palette.background.default,
					height: '100%',
					width: '100%',
					overflowY: 'hidden',
					borderRadius: '16px',
				}}>
				{chats && (
					<List sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5), overflowY: 'scroll' }}>
						{chats.map((chat) => (
							<ListItem
								key={chat._id}
								sx={{
									cursor: 'pointer',
									bgcolor:
										selectedChat?._id === chat._id ? theme.palette.primary.lighter : theme.palette.background.paper,
									color: selectedChat?._id === chat._id ? theme.palette.primary.darker : theme.palette.text.primary,
									px: theme.spacing(3),
									py: theme.spacing(2),
									borderRadius: '7px',
									boxShadow: selectedChat?._id === chat._id ? theme.customShadows.primary : theme.customShadows.z1,
								}}
								onClick={changeChatHandler.bind(this, chat)}>
								<Typography variant='subtitle1'>{chat.chatName}</Typography>
								{chat.latestMessage && (
									<Typography variant='body1'>
										<b>{chat.latestMessage.sender.name} : </b>
										{chat.latestMessage.content.length > 50
											? chat.latestMessage.content.substring(0, 51) + '...'
											: chat.latestMessage.content}
									</Typography>
								)}
							</ListItem>
						))}
					</List>
				)}
				{chatListLoading && <CircularProgress />}
				{chatListError && (
					<Typography variant='subtitle1' color='error'>
						Something went wrong! Try reloading the page!
					</Typography>
				)}
			</Card>
		</Card>
	);
};

export default ChatsList;
