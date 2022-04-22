import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import ChatsList from '../components/chat/ChatsList';
import ChatBox from '../components/chat/ChatBox';

const ChatScreen = () => {
	const navigate = useNavigate();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	return (
		<div style={{ width: '100%' }}>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '0.4fr 1fr',
					justifyContent: 'space-between',
					width: '100%',
					height: '84vh',
					p: 1,
					gap: 2,
				}}>
				<ChatsList />
				<ChatBox />
			</Box>
		</div>
	);
};

export default ChatScreen;
