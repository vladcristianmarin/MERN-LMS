import {
	LIST_TEACHERS_FAIL,
	LIST_TEACHERS_REQUEST,
	LIST_TEACHERS_SUCCESS,
	LIST_TEACHER_COURSES_FAIL,
	LIST_TEACHER_COURSES_REQUEST,
	LIST_TEACHER_COURSES_SUCCESS,
} from '../constants/teacherConstants';

export const teacherListReducer = (state = { teachers: [] }, action) => {
	switch (action.type) {
		case LIST_TEACHERS_REQUEST:
			return { loading: true };
		case LIST_TEACHERS_SUCCESS:
			return { loading: false, teachers: action.payload, success: true };
		case LIST_TEACHERS_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};

export const teacherListCoursesReducer = (state = { courses: [] }, action) => {
	switch (action.type) {
		case LIST_TEACHER_COURSES_REQUEST:
			return { loading: true };
		case LIST_TEACHER_COURSES_SUCCESS:
			return { loading: false, courses: action.payload, success: true };
		case LIST_TEACHER_COURSES_FAIL:
			return { loading: false, error: action.payload, success: false };
		default:
			return state;
	}
};
