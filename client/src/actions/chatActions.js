import axios from 'axios';
import io from 'socket.io-client';
import {
	CHANGE_SELECTED_CHAT,
	GET_CHAT_INFO_FAIL,
	GET_CHAT_INFO_REQUEST,
	GET_CHAT_INFO_SUCCESS,
	LIST_CHAT_MESSAGES_FAIL,
	LIST_CHAT_MESSAGES_REQUEST,
	LIST_CHAT_MESSAGES_SUCCESS,
	LIST_USER_CHATS_FAIL,
	LIST_USER_CHATS_REQUEST,
	LIST_USER_CHATS_SUCCESS,
	SEND_CHAT_MESSAGE_FAIL,
	SEND_CHAT_MESSAGE_REQUEST,
	SEND_CHAT_MESSAGE_SUCCESS,
} from '../constants/chatConstants';
import { ENDPOINT } from '../constants/endpoint';

const socket = io(ENDPOINT);

export const changeSelectedChat = (chat) => (dispatch) => {
	dispatch({ type: CHANGE_SELECTED_CHAT, payload: chat });
};

export const getChatById = (chatId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_CHAT_INFO_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get(`/api/chats/${chatId}`, config);

		dispatch({ type: GET_CHAT_INFO_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: GET_CHAT_INFO_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

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

export const listMessages = (chatId) => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_CHAT_MESSAGES_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get(`/api/messages/${chatId}`, config);
		dispatch({ type: LIST_CHAT_MESSAGES_SUCCESS, payload: data });
		// socket.emit('join chat', chatId);
	} catch (error) {
		dispatch({
			type: LIST_CHAT_MESSAGES_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
export const sendMessage = (chatId, content) => async (dispatch, getState) => {
	try {
		dispatch({ type: SEND_CHAT_MESSAGE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post(`/api/messages/${chatId}`, { content }, config);

		dispatch({ type: SEND_CHAT_MESSAGE_SUCCESS, payload: data });
		socket.emit('send message', data);
	} catch (error) {
		dispatch({
			type: SEND_CHAT_MESSAGE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
