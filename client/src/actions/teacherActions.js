import axios from 'axios';
import {
	LIST_TEACHERS_FAIL,
	LIST_TEACHERS_REQUEST,
	LIST_TEACHERS_SUCCESS,
	LIST_TEACHER_COURSES_FAIL,
	LIST_TEACHER_COURSES_REQUEST,
	LIST_TEACHER_COURSES_SUCCESS,
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
