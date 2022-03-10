import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		if (!userInfo) {
			navigate('/login', { replace: true });
		}
	}, [userInfo, navigate]);
	return <div>HomeScreen</div>;
};

export default HomeScreen;
