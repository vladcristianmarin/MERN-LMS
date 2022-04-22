import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, CircularProgress, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

import Iconify from '../Iconify';
import { useLottie } from 'lottie-react';
import animationData from './animations/typing.json';
import ScrollableChat from './ScrollableChat';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { listMessages } from '../../actions/chatActions';

const ENDPOINT = 'http://127.0.0.1:3030';
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
	const location = useLocation();
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const [socketConnected, setSocketConnected] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const chatMessages = useSelector((state) => state.chatMessages);
	const { loading: messagesLoading, error: messagesError, messages } = chatMessages;

	const { selectedChat } = useSelector((state) => state.selectedChat);

	useEffect(() => {
		if (selectedChat) {
			dispatch(listMessages(selectedChat._id));
		}
	}, [dispatch, selectedChat]);

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', userInfo);
		socket.on('connection', () => setSocketConnected(true));
		// eslint-disable-next-line
	}, []);

	const typeHandler = (e) => {
		setIsTyping(true);
		setMessage(e.target.value);
	};

	const sendMessage = async (e) => {
		if ((e.type === 'click' || e.key === 'Enter') && message) {
			console.log('Sent!');
			setMessage('');
			setIsTyping(false);
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
						<ScrollableChat />
					)}
				</Box>
			)}
			{!messagesLoading && !messagesError && (
				<FormControl fullWidth onKeyDown={sendMessage}>
					{isTyping && (
						<div style={{ width: '70px', marginBottom: '15px' }}>
							<TypingAnimation />
						</div>
					)}
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
										onClick={sendMessage}>
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
