import { LIST_USER_CHATS_FAIL, LIST_USER_CHATS_REQUEST, LIST_USER_CHATS_SUCCESS } from '../constants/chatConstants';

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
