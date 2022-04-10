import {
	GROUP_ADD_STUDENTS_FAIL,
	GROUP_ADD_STUDENTS_REQUEST,
	GROUP_ADD_STUDENTS_RESET,
	GROUP_ADD_STUDENTS_SUCCESS,
	GROUP_CREATE_FAIL,
	GROUP_CREATE_REQUEST,
	GROUP_CREATE_RESET,
	GROUP_CREATE_SUCCESS,
	GROUP_DELETE_FAIL,
	GROUP_DELETE_REQUEST,
	GROUP_DELETE_RESET,
	GROUP_DELETE_SUCCESS,
	GROUP_ENROLL_COURSE_FAIL,
	GROUP_ENROLL_COURSE_REQUEST,
	GROUP_ENROLL_COURSE_RESET,
	GROUP_ENROLL_COURSE_SUCCESS,
	GROUP_REMOVE_COURSE_FAIL,
	GROUP_REMOVE_COURSE_REQUEST,
	GROUP_REMOVE_COURSE_RESET,
	GROUP_REMOVE_COURSE_SUCCESS,
	GROUP_REMOVE_STUDENT_FAIL,
	GROUP_REMOVE_STUDENT_REQUEST,
	GROUP_REMOVE_STUDENT_RESET,
	GROUP_REMOVE_STUDENT_SUCCESS,
	GROUP_UPDATE_FAIL,
	GROUP_UPDATE_REQUEST,
	GROUP_UPDATE_RESET,
	GROUP_UPDATE_SUCCESS,
	LIST_GROUPS_CLIENT_UPDATE,
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
		case LIST_GROUPS_CLIENT_UPDATE:
			return { groups: action.payload };
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

export const groupAddStudentsReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_ADD_STUDENTS_REQUEST:
			return { loading: true };
		case GROUP_ADD_STUDENTS_SUCCESS:
			return { loading: false, group: action.payload, success: true };
		case GROUP_ADD_STUDENTS_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_ADD_STUDENTS_RESET: {
			return {};
		}
		default:
			return state;
	}
};

export const groupRemoveStudentReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_REMOVE_STUDENT_REQUEST:
			return { loading: true };
		case GROUP_REMOVE_STUDENT_SUCCESS:
			return { loading: false, removedStudent: action.payload, success: true };
		case GROUP_REMOVE_STUDENT_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_REMOVE_STUDENT_RESET: {
			return {};
		}
		default:
			return state;
	}
};

export const groupEnrollCourseReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_ENROLL_COURSE_REQUEST:
			return { loading: true };
		case GROUP_ENROLL_COURSE_SUCCESS:
			return { loading: false, group: action.payload, success: true };
		case GROUP_ENROLL_COURSE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_ENROLL_COURSE_RESET: {
			return {};
		}
		default:
			return state;
	}
};

export const groupRemoveCourseReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_REMOVE_COURSE_REQUEST:
			return { loading: true };
		case GROUP_REMOVE_COURSE_SUCCESS:
			return { loading: false, group: action.payload, success: true };
		case GROUP_REMOVE_COURSE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_REMOVE_COURSE_RESET: {
			return {};
		}
		default:
			return state;
	}
};

export const groupUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case GROUP_UPDATE_REQUEST:
			return { loading: true };
		case GROUP_UPDATE_SUCCESS:
			return { loading: false, updatedCourse: action.payload, success: true };
		case GROUP_UPDATE_FAIL:
			return { loading: false, error: action.payload, success: false };
		case GROUP_UPDATE_RESET: {
			return {};
		}
		default:
			return state;
	}
};
