import {
	EXAM_CREATE_FAIL,
	EXAM_CREATE_REQUEST,
	EXAM_CREATE_RESET,
	EXAM_CREATE_SUCCESS,
	LIST_STUDENT_EXAMS_FAIL,
	LIST_STUDENT_EXAMS_REQUEST,
	LIST_STUDENT_EXAMS_SUCCESS,
} from '../constants/examConstants';

export const examCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case EXAM_CREATE_REQUEST:
			return { loading: true };
		case EXAM_CREATE_SUCCESS:
			return { loading: false, exam: action.payload, success: true };
		case EXAM_CREATE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case EXAM_CREATE_RESET:
			return { loading: false };
		default:
			return state;
	}
};

export const examListStudentReducer = (state = { exams: [] }, action) => {
	switch (action.type) {
		case LIST_STUDENT_EXAMS_REQUEST:
			return { loading: true };
		case LIST_STUDENT_EXAMS_SUCCESS:
			return { loading: false, exams: action.payload, success: true };
		case LIST_STUDENT_EXAMS_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};
