import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, CircularProgress, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

import Iconify from '../Iconify';
import ScrollableChat from './ScrollableChat';

import { useDispatch, useSelector } from 'react-redux';
import { listMessages, sendMessage } from '../../actions/chatActions';
import { ENDPOINT } from '../../constants/endpoint';

const Chat = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [typingClient, setTypingClient] = useState({});

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const chatMessages = useSelector((state) => state.chatMessages);
	const { loading: messagesLoading, error: messagesError, messages: oldMessages } = chatMessages;

	const { selectedChat } = useSelector((state) => state.selectedChat);

	const sendMessageState = useSelector((state) => state.sendMessage);
	const { loading: sendMessageLoading, error: sendMessageError, message: newMessage } = sendMessageState;

	useEffect(() => {
		const newSocket = io(ENDPOINT);
		newSocket.emit('setup', userInfo);
		setSocket(newSocket);
		return () => newSocket.close();
	}, [userInfo]);

	useEffect(() => {
		if (socket && selectedChat) {
			dispatch(listMessages(selectedChat._id));
			socket.emit('join chat', selectedChat._id);

			return () => socket.off('join chat', selectedChat._id);
		}
	}, [dispatch, selectedChat, socket]);

	useEffect(() => {
		if (socket) {
			const messageListener = (message) => {
				setMessages((prevMessages) => [...prevMessages, message]);
			};
			const typingListener = (user) => {
				setIsTyping(true);
				setTypingClient(user);
			};
			const stopTypingListener = () => {
				setIsTyping(false);
				setTypingClient({});
			};

			socket.on('message received', messageListener);
			socket.on('typing', typingListener);
			socket.on('stop typing', stopTypingListener);
			return () => {
				socket.off('message received', messageListener);
				socket.off('typing', typingListener);
				socket.off('stop typing', stopTypingListener);
			};
		}
	}, [socket]);

	useEffect(() => {
		if (oldMessages && !messagesError && !messagesLoading) {
			setMessages(oldMessages);
		}
	}, [messagesError, messagesLoading, oldMessages]);

	useEffect(() => {
		if (newMessage && !sendMessageError && !sendMessageLoading) {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}
	}, [sendMessageError, sendMessageLoading, newMessage]);

	useEffect(() => {
		if (socket && selectedChat && !typing) {
			socket.emit('stop typing', selectedChat._id);
			return () => socket.off('stop typing', selectedChat._id);
		}
	}, [typing, socket, selectedChat]);

	useEffect(() => {
		setTyping(true);
		const timerLength = message.length === 0 ? 600 : 3000;
		const timer = setTimeout(() => {
			setTyping(false);
		}, timerLength);

		return () => {
			clearTimeout(timer);
		};
	}, [message]);

	const typeHandler = (e) => {
		setMessage(e.target.value);
		socket.emit('typing', selectedChat._id, userInfo);
	};

	const sendMessageHandler = (e) => {
		if ((e.type === 'click' || e.key === 'Enter') && message) {
			setMessage('');
			dispatch(sendMessage(selectedChat._id, message));
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: messagesLoading || messagesError ? 'center' : 'flex-end',
				padding: theme.spacing(2),
				bgcolor: theme.palette.background.default,
				backgroundImage:
					'radial-gradient(circle at 13% 47%, rgba(140,140,140, 0.08) 0%, rgba(140,140,140, 0.08) 25%,transparent 25%, transparent 100%),radial-gradient(circle at 28% 63%, rgba(143,143,143, 0.1) 0%, rgba(143,143,143, 0.1) 16%,transparent 16%, transparent 100%),radial-gradient(circle at 81% 56%, rgba(65,65,65, 0.08) 0%, rgba(65,65,65, 0.08) 12%,transparent 12%, transparent 100%),radial-gradient(circle at 26% 48%, rgba(60,60,60, 0.09) 0%, rgba(60,60,60, 0.09) 6%,transparent 6%, transparent 100%),radial-gradient(circle at 97% 17%, rgba(150,150,150, 0.13) 0%, rgba(150,150,150, 0.13) 56%,transparent 56%, transparent 100%),radial-gradient(circle at 50% 100%, rgba(25, 25, 25,0.03) 0%, rgba(25, 25, 25,0.03) 36%,transparent 36%, transparent 100%),radial-gradient(circle at 55% 52%, rgba(69, 69, 69,0.03) 0%, rgba(69, 69, 69,0.03) 6%,transparent 6%, transparent 100%),linear-gradient(90deg, rgb(249,250,251),rgb(249,250,251));',
				overflowY: 'hidden',
				height: '100%',
				width: '100%',
				borderRadius: '16px',
			}}>
			{messagesLoading ? (
				<CircularProgress sx={{ alignSelf: 'center' }} />
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'scroll', scrollbarWidth: 'none' }}>
					{messagesError ? (
						<Typography variant='h5' color='error' textAlign='center'>
							Something went wrong! Try reloading the page!
						</Typography>
					) : (
						<ScrollableChat messages={messages} isTyping={isTyping} typingClient={typingClient} />
					)}
				</Box>
			)}
			{!messagesLoading && !messagesError && (
				<FormControl fullWidth onKeyDown={sendMessageHandler}>
					<TextField
						placeholder='Type...'
						value={message}
						onChange={typeHandler}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										color='primary'
										edge='end'
										sx={{ transform: 'rotate(45deg)', mr: 1, pr: 1 }}
										onClick={sendMessageHandler}>
										<Iconify icon='eva:paper-plane-outline' />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</FormControl>
			)}
		</Box>
	);
};

export default Chat;
