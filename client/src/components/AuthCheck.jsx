import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '../actions/userActions';
import clearStorage from '../utils/clearStorage';

const AuthCheck = () => {
	const dispatch = useDispatch();
	const userLogin = useSelector((state) => state.userLogin);
	const { expired } = userLogin;
	useEffect(() => {
		dispatch(verifyToken());
	}, [dispatch]);
	useEffect(() => {
		if (expired === true) {
			clearStorage();
		}
	}, [expired]);
	return <></>;
};

export default AuthCheck;
