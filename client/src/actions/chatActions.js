import axios from 'axios';
import { LIST_USER_CHATS_FAIL, LIST_USER_CHATS_REQUEST, LIST_USER_CHATS_SUCCESS } from '../constants/chatConstants';

export const listChats = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_USER_CHATS_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get('/api/chats', config);

		dispatch({ type: LIST_USER_CHATS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LIST_USER_CHATS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
