import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ChatScreen = () => {
	const location = useLocation();
	const [chatId, setChatId] = useState();

	useEffect(() => {
		setChatId(location.pathname.replace('/student/courses/chat/', ''));
	}, [location]);

	console.log(chatId);
	return <div>ChatScreen</div>;
};

export default ChatScreen;
