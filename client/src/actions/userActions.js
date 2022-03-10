import axios from 'axios';
import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	VERIFY_TOKEN,
} from '../constants/userContstants';

export const verifyToken = () => async (dispatch, getState) => {
	const {
		userLogin: { authToken },
	} = getState();
	if (authToken) {
		const { data } = await axios.get(`/api/users/verify/${authToken}`);
		dispatch({ type: VERIFY_TOKEN, payload: data });
	}
};

export const login = (email, password, remember) => async (dispatch) => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST });
		const config = { headers: { 'Content-Type': 'application/json' } };
		const { data } = await axios.post(
			'/api/users/login',
			{ email, password, remember },
			config
		);
		dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
		localStorage.setItem('userInfo', JSON.stringify(data.user));
		localStorage.setItem('authToken', JSON.stringify(data.token));
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const logout = () => async (dispatch, getState) => {
	const {
		userLogin: { authToken },
	} = getState();

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authToken}`,
		},
	};
	await axios.post('/api/users/logout', {}, config);
	dispatch({ type: USER_LOGOUT });
	localStorage.removeItem('userInfo');
	localStorage.removeItem('authToken');
};
