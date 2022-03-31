import {
	GROUP_CREATE_FAIL,
	GROUP_CREATE_REQUEST,
	GROUP_CREATE_RESET,
	GROUP_CREATE_SUCCESS,
	GROUP_DELETE_FAIL,
	GROUP_DELETE_REQUEST,
	GROUP_DELETE_RESET,
	GROUP_DELETE_SUCCESS,
	LIST_GROUPS_FAIL,
	LIST_GROUPS_REQUEST,
	LIST_GROUPS_SUCCESS,
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

export const groupListReducer = (state = { groups: [] }, action) => {
	switch (action.type) {
		case LIST_GROUPS_REQUEST:
			return { loading: true };
		case LIST_GROUPS_SUCCESS:
			return { loading: false, groups: action.payload, success: true };
		case LIST_GROUPS_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};

export const groupDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_DELETE_REQUEST:
			return { loading: true };
		case GROUP_DELETE_SUCCESS:
			return { loading: false, deletedGroup: action.payload, success: true };
		case GROUP_DELETE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_DELETE_RESET: {
			return {};
		}
		default:
			return state;
	}
};
