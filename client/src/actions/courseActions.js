import axios from 'axios';
import { COURSE_CREATE_FAIL, COURSE_CREATE_REQUEST, COURSE_CREATE_SUCCESS } from '../constants/courseConstants';

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
