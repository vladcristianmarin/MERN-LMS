import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT_FAIL,
	USER_LOGOUT_REQUEST,
	USER_LOGOUT_SUCCESS,
	USER_MAKE_ADMIN_FAIL,
	USER_MAKE_ADMIN_REQUEST,
	USER_MAKE_ADMIN_RESET,
	USER_MAKE_ADMIN_SUCCESS,
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	VERIFY_TOKEN,
} from '../constants/userConstants';

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case VERIFY_TOKEN:
			return { ...state, expired: action.payload };
		case USER_LOGIN_REQUEST:
			return { ...state, loading: true };
		case USER_LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				userInfo: action.payload.user,
				authToken: action.payload.token,
			};
		case USER_LOGIN_FAIL:
			return { ...state, loading: false, userInfo: null, error: action.payload };

		case USER_LOGOUT_REQUEST:
			return { ...state, logoutLoading: true };
		case USER_LOGOUT_SUCCESS:
			return {
				...state,
				logoutLoading: false,
				userInfo: null,
				authToken: null,
			};
		case USER_LOGOUT_FAIL:
			return { ...state, logoutLoading: false, logoutError: action.payload };
		default:
			return state;
	}
};

export const userRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_REGISTER_REQUEST:
			return { loading: true };
		case USER_REGISTER_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case USER_REGISTER_FAIL:
			return { loading: false, success: false, error: action.payload };
		default:
			return state;
	}
};

export const userMakeAdminReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_MAKE_ADMIN_REQUEST:
			return { loading: true };
		case USER_MAKE_ADMIN_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case USER_MAKE_ADMIN_FAIL:
			return { loading: false, success: false, error: action.payload };
		case USER_MAKE_ADMIN_RESET:
			return {};
		default:
			return state;
	}
};
