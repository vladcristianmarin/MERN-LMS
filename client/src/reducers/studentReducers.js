import {
	LIST_STUDENTS_FAIL,
	LIST_STUDENTS_REQUEST,
	LIST_STUDENTS_SUCCESS,
	STUDENT_CHANGE_GROUP_FAIL,
	STUDENT_CHANGE_GROUP_REQUEST,
	STUDENT_CHANGE_GROUP_RESET,
	STUDENT_CHANGE_GROUP_SUCCESS,
} from '../constants/studentConstants';

export const studentListReducer = (state = { teachers: [] }, action) => {
	switch (action.type) {
		case LIST_STUDENTS_REQUEST:
			return { loading: true };
		case LIST_STUDENTS_SUCCESS:
			return { loading: false, students: action.payload, success: true };
		case LIST_STUDENTS_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};
export const studentChangeGroupReducer = (state = {}, action) => {
	switch (action.type) {
		case STUDENT_CHANGE_GROUP_REQUEST:
			return { loading: true };
		case STUDENT_CHANGE_GROUP_SUCCESS:
			return { loading: false, student: action.payload, success: true };
		case STUDENT_CHANGE_GROUP_FAIL:
			return { loading: false, error: action.payload, success: false };
		case STUDENT_CHANGE_GROUP_RESET:
			return {};
		default:
			return state;
	}
};
