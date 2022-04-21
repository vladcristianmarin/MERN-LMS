import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { listChats } from '../actions/chatActions';

import { Box } from '@mui/material';
import ChatsList from '../components/chat/ChatsList';
import ChatBox from '../components/chat/ChatBox';

const ChatScreen = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const [selectedChat, setSelectedChat] = useState('');
	const [selectedChatInfo, setSelectedChatInfo] = useState({});

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);

	const chatList = useSelector((state) => state.chatList);
	const { error: chatListError, loading: chatListLoading, chats } = chatList;

	useEffect(() => {
		dispatch(listChats());
	}, [dispatch]);

	useEffect(() => {
		const chatIdFromURL = location.pathname.replace('/student/courses/chat/', '');
		setSelectedChat(chatIdFromURL);
	}, [location]);

	useEffect(() => {
		const chat = chats?.filter((c) => c._id === selectedChat).shift();
		setSelectedChatInfo(chat);
	}, [chats, selectedChat]);

	return (
		<div style={{ width: '100%' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
					height: '84vh',
					p: 1,
					gap: 2,
				}}>
				<ChatsList />
				<ChatBox selectedChat={selectedChatInfo} />
			</Box>
		</div>
	);
};

export default ChatScreen;
