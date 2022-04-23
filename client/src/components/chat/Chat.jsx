import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, CircularProgress, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

import Iconify from '../Iconify';
import { useLottie } from 'lottie-react';
import animationData from './animations/typing.json';
import ScrollableChat from './ScrollableChat';
import { useDispatch, useSelector } from 'react-redux';
import { listMessages, sendMessage } from '../../actions/chatActions';
import { ENDPOINT } from '../../constants/endpoint';

let socket;

const TypingAnimation = () => {
	const { View } = useLottie({
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	});

	return View;
};

const Chat = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [socketConnected, setSocketConnected] = useState(false);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const chatMessages = useSelector((state) => state.chatMessages);
	const { loading: messagesLoading, error: messagesError, messages: oldMessages } = chatMessages;

	const sendMessageState = useSelector((state) => state.sendMessage);
	const { loading: sendMessageLoading, error: sendMessageError, message: newMessage } = sendMessageState;

	const { selectedChat } = useSelector((state) => state.selectedChat);

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', userInfo);
		socket.on('connected', () => setSocketConnected(true));
		socket.on('typing', () => {
			console.log('typing');
		});
		socket.on('stop typing', () => console.log('stopped typing'));
		socket.on('message received', (message) => {
			if (selectedChat && selectedChat._id === message.chat._id) {
				setMessages((prev) => [...prev, message]);
			}
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (selectedChat) {
			dispatch(listMessages(selectedChat._id));
			selectedChatCompare = selectedChat;
			socket.emit('join chat', selectedChat._id);
		}
		// eslint-disable-next-line
	}, [selectedChat]);

	useEffect(() => {
		if (oldMessages && !messagesError && !messagesLoading) {
			setMessages(oldMessages);
		}
	}, [oldMessages, messagesError, messagesLoading]);

	useEffect(() => {
		if (newMessage && !sendMessageLoading && !sendMessageError) {
			setMessages((prev) => [...prev, newMessage]);
		}
	}, [newMessage, sendMessageError, sendMessageLoading]);

	const typeHandler = (e) => {
		setMessage(e.target.value);
		socket.emit('typing', selectedChat._id);
	};

	const sendMessageHandler = (e) => {
		if ((e.type === 'click' || e.key === 'Enter') && message) {
			dispatch(sendMessage(selectedChat._id, message));
			setMessage('');
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
						<ScrollableChat messages={messages} />
					)}
				</Box>
			)}
			{!messagesLoading && !messagesError && (
				<FormControl fullWidth onKeyDown={sendMessageHandler}>
					{/* {istyping && (
						<div style={{ width: '70px' }}>
							<TypingAnimation />
						</div>
					)} */}
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
