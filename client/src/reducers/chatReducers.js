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

export const selectedChatReducer = (state = {}, action) => {
	switch (action.type) {
		case CHANGE_SELECTED_CHAT:
			return { selectedChat: action.payload };
		default:
			return state;
	}
};

export const chatListReducer = (state = {}, action) => {
	switch (action.type) {
		case LIST_USER_CHATS_REQUEST:
			return { loading: true };
		case LIST_USER_CHATS_SUCCESS:
			return { loading: false, chats: action.payload, success: true };
		case LIST_USER_CHATS_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};

export const messagesListReduces = (state = {}, action) => {
	switch (action.type) {
		case LIST_CHAT_MESSAGES_REQUEST:
			return { loading: true };
		case LIST_CHAT_MESSAGES_SUCCESS:
			return { loading: false, messages: action.payload, success: true };
		case LIST_CHAT_MESSAGES_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};

export const sendMessageReducer = (state = {}, action) => {
	switch (action.type) {
		case SEND_CHAT_MESSAGE_REQUEST:
			return { loading: true };
		case SEND_CHAT_MESSAGE_SUCCESS:
			return { loading: false, message: action.payload, success: true };
		case SEND_CHAT_MESSAGE_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};

export const chatInfoReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_CHAT_INFO_REQUEST:
			return { loading: true };
		case GET_CHAT_INFO_SUCCESS:
			return { loading: false, chat: action.payload, success: true };
		case GET_CHAT_INFO_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};
