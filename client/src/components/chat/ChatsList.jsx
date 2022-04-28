import React, { useEffect, useState } from 'react';
import { Card, CircularProgress, IconButton, List, ListItem, Stack, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedChat, listChats } from '../../actions/chatActions';
import { useNavigate } from 'react-router-dom';
import { formatDate } from './utils/dateformatting';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Box } from '@mui/system';
import Iconify from '../Iconify';
import { ENDPOINT } from '../../constants/endpoint';
import { io } from 'socket.io-client';

const ChatsList = React.forwardRef((props, ref) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [socket, setSocket] = useState(null);

	const { selectedChat } = useSelector((state) => state.selectedChat);
	const chatList = useSelector((state) => state.chatList);
	const { error: chatListError, loading: chatListLoading, chats } = chatList;

	useEffect(() => {
		const newSocket = io(ENDPOINT);
		setSocket(newSocket);
		return () => {
			newSocket.close();
		};
	}, []);

	useEffect(() => {
		dispatch(listChats());
	}, [dispatch]);

	const changeChatHandler = (chat) => {
		socket.emit('leave chat', selectedChat);
		dispatch(changeSelectedChat(chat));
		navigate(`/chat/${chat._id}`, { replace: true });
	};

	const refreshChatListHandler = () => {
		dispatch(listChats());
	};

	return (
		<Card
			ref={ref}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				flex: 0.35,
				padding: theme.spacing(2),
				background: theme.palette.background.paper,
				width: '100%',
				gap: theme.spacing(2),
			}}>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
				<Typography variant='h4'>My Chats</Typography>
				<IconButton color='primary' onClick={refreshChatListHandler}>
					<Iconify icon='eva:refresh-outline' />
				</IconButton>
			</Box>
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
					<SimpleBar style={{ maxHeight: '100%' }}>
						<List
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: theme.spacing(1.5),
								overflowY: 'scroll',
							}}>
							{chats.map((chat) => (
								<ListItem
									key={chat._id}
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
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
									<Stack>
										<Typography variant='subtitle1' sx={{ fontSize: theme.typography.h5.fontSize }}>
											{chat.chatName}
										</Typography>
										{chat.latestMessage && (
											<Typography variant='body1'>
												{chat.latestMessage.sender.name}:{' '}
												{chat.latestMessage.content.length > 50
													? chat.latestMessage.content.substring(0, 51) + '...'
													: chat.latestMessage.content}
											</Typography>
										)}
									</Stack>
									{chat.latestMessage && (
										<Typography variant='body1'>{formatDate(chat.latestMessage.createdAt)}</Typography>
									)}
								</ListItem>
							))}
						</List>
					</SimpleBar>
				)}
				{chatListLoading && <CircularProgress sx={{ alignSelf: 'center', justifySelf: 'center' }} />}
				{chatListError && (
					<Typography variant='subtitle1' color='error'>
						Something went wrong! Try reloading the page!
					</Typography>
				)}
			</Card>
		</Card>
	);
});

export default ChatsList;
