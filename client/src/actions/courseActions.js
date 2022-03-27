import axios from 'axios';
import {
	COURSE_CREATE_FAIL,
	COURSE_CREATE_REQUEST,
	COURSE_CREATE_SUCCESS,
	COURSE_DELETE_FAIL,
	COURSE_DELETE_REQUEST,
	COURSE_DELETE_SUCCESS,
} from '../constants/courseConstants';

export const createCourse = (name, acronym, teacher, description) => async (dispatch, getState) => {
	try {
		dispatch({ type: COURSE_CREATE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post('/api/courses', { name, acronym, teacher, description }, config);

		dispatch({ type: COURSE_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: COURSE_CREATE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
export const deleteCourse = (courseId) => async (dispatch, getState) => {
	try {
		dispatch({ type: COURSE_DELETE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.delete(`/api/courses/${courseId}`, config);

		dispatch({ type: COURSE_DELETE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: COURSE_DELETE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
