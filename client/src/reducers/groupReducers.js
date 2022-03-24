import {
	GROUP_CREATE_FAIL,
	GROUP_CREATE_REQUEST,
	GROUP_CREATE_RESET,
	GROUP_CREATE_SUCCESS,
} from '../constants/groupConstants';

export const groupCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_CREATE_REQUEST:
			return { loading: true };
		case GROUP_CREATE_SUCCESS:
			return { loading: false, groupInfo: action.payload, success: true };
		case GROUP_CREATE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_CREATE_RESET:
			return {};
		default:
			return state;
	}
};
