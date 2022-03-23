import {
	COURSE_CREATE_FAIL,
	COURSE_CREATE_REQUEST,
	COURSE_CREATE_RESET,
	COURSE_CREATE_SUCCESS,
} from '../constants/courseConstants';

export const courseCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case COURSE_CREATE_REQUEST:
			return { loading: true };
		case COURSE_CREATE_SUCCESS:
			return { loading: false, courseInfo: action.payload, success: true };
		case COURSE_CREATE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case COURSE_CREATE_RESET:
			return {};
		default:
			return state;
	}
};
