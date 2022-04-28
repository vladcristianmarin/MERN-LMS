import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, FormControlLabel, Slide, Switch } from '@mui/material';
import ChatsList from '../components/chat/ChatsList';
import ChatBox from '../components/chat/ChatBox';
import { useTheme } from '@emotion/react';

import styled from '@emotion/styled';

const ChatScreen = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [chatListVisible, setChatListVisible] = useState(false);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	const IOSSwitch = styled((props) => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(
		({ theme }) => ({
			width: 42,
			height: 26,
			padding: 0,
			'& .MuiSwitch-switchBase': {
				padding: 0,
				margin: 2,
				transitionDuration: '300ms',
				'&.Mui-checked': {
					transform: 'translateX(16px)',
					color: '#fff',
					'& + .MuiSwitch-track': {
						backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
						opacity: 1,
						border: 0,
					},
					'&.Mui-disabled + .MuiSwitch-track': {
						opacity: 0.5,
					},
				},
				'&.Mui-focusVisible .MuiSwitch-thumb': {
					color: '#33cf4d',
					border: '6px solid #fff',
				},
				'&.Mui-disabled .MuiSwitch-thumb': {
					color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
				},
				'&.Mui-disabled + .MuiSwitch-track': {
					opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
				},
			},
			'& .MuiSwitch-thumb': {
				boxSizing: 'border-box',
				width: 22,
				height: 22,
			},
			'& .MuiSwitch-track': {
				borderRadius: 26 / 2,
				backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
				opacity: 1,
				transition: theme.transitions.create(['background-color'], {
					duration: 500,
				}),
			},
		})
	);

	const chatListVisibilityHandler = (e) => {
		setChatListVisible(e.target.checked);
	};

	return (
		<div style={{ width: '100%' }}>
			<FormControlLabel
				sx={{ marginTop: `-${theme.spacing(3)}` }}
				componentsProps={{ typography: theme.typography.subtitle1 }}
				control={<IOSSwitch sx={{ m: 1 }} checked={chatListVisible} onChange={chatListVisibilityHandler} />}
				label='SHOW CHATS'
			/>

			<Box
				sx={{
					width: '100%',
					height: '84vh',
					display: 'flex',
					gap: theme.spacing(1),
					py: theme.spacing(1),
				}}>
				<Slide direction='right' timeout={500} in={chatListVisible} mountOnEnter unmountOnExit>
					<ChatsList show={chatListVisible} />
				</Slide>
				<ChatBox />
			</Box>
		</div>
	);
};

export default ChatScreen;
