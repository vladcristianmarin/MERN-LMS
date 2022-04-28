import axios from 'axios';
import {
	LIST_TEACHERS_FAIL,
	LIST_TEACHERS_REQUEST,
	LIST_TEACHERS_SUCCESS,
	LIST_TEACHER_COURSES_FAIL,
	LIST_TEACHER_COURSES_REQUEST,
	LIST_TEACHER_COURSES_SUCCESS,
	TEACHER_MY_COURSES_FAIL,
	TEACHER_MY_COURSES_REQUEST,
	TEACHER_MY_COURSES_SUCCESS,
} from '../constants/teacherConstants';

export const listTeachers = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_TEACHERS_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get('/api/teachers', config);

		dispatch({ type: LIST_TEACHERS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LIST_TEACHERS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const listTeacherCourses = (teacherId) => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_TEACHER_COURSES_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get(`/api/teachers/${teacherId}/courses`, config);

		dispatch({ type: LIST_TEACHER_COURSES_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LIST_TEACHER_COURSES_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const getMyCourses = () => async (dispatch, getState) => {
	try {
		dispatch({ type: TEACHER_MY_COURSES_REQUEST });
		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };
		const { data } = await axios.get('/api/teachers/mycourses', config);

		const courses = data.courses;
		const groups = data.groups;

		courses.forEach((c) => (c.groups = []));
		groups.forEach((group) => {
			group.courses.forEach((groupCourse) => {
				courses.forEach((course) => {
					course._id === groupCourse && course.groups.push(group);
				});
			});
		});
		dispatch({
			type: TEACHER_MY_COURSES_SUCCESS,
			payload: courses,
		});
	} catch (error) {
		dispatch({
			type: TEACHER_MY_COURSES_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
