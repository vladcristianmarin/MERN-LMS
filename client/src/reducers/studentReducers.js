import { LIST_STUDENTS_FAIL, LIST_STUDENTS_REQUEST, LIST_STUDENTS_SUCCESS } from '../constants/studentConstants';

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
