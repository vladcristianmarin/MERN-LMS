import React, { useState } from 'react';
import {
	Box,
	CircularProgress,
	Container,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	TextField,
	Typography,
} from '@mui/material';
import { useTheme } from '@emotion/react';

import Iconify from '../Iconify';
import { useLottie } from 'lottie-react';
import animationData from './animations/typing.json';
import ScrollableChat from './ScrollableChat';

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
	const [message, setMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);

	//! To delete
	const loading = false;

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
				justifyContent: loading ? 'center' : 'flex-end',
				padding: theme.spacing(2),
				bgcolor: theme.palette.background.default,
				overflowY: 'hidden',
				height: '100%',
				width: '100%',
				borderRadius: '16px',
			}}>
			{loading ? (
				<CircularProgress sx={{ alignSelf: 'center' }} />
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'scroll', scrollbarWidth: 'none' }}>
					<ScrollableChat />
				</Box>
			)}
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
		</Box>
	);
};

export default Chat;
