import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StudentHomeScreen from './StudentHomeScreen';

const HomeScreen = () => {
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
		if (userInfo && userInfo.isAdmin) {
			navigate('/admin', { replace: true });
		}
	}, [userInfo, navigate]);
	return <StudentHomeScreen />;
};

export default HomeScreen;
