import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	VERIFY_TOKEN,
} from '../constants/userContstants';

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case VERIFY_TOKEN:
			return { ...state, expired: action.payload };
		case USER_LOGIN_REQUEST:
			return { loading: true };
		case USER_LOGIN_SUCCESS:
			return {
				loading: false,
				userInfo: action.payload.user,
				authToken: action.payload.token,
			};
		case USER_LOGIN_FAIL:
			return { loading: false, userInfo: null, error: action.payload };
		case USER_LOGOUT:
			return { userInfo: null, authToken: null };
		default:
			return state;
	}
};
