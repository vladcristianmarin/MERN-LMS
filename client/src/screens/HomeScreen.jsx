import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StudentHomeScreen from './StudentHomeScreen';

const HomeScreen = () => {
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		console.log(userInfo);
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);
	return <>{userInfo?.role === 'Student' && <StudentHomeScreen />}</>;
};

export default HomeScreen;
