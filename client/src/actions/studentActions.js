import axios from 'axios';
import { LIST_STUDENTS_FAIL, LIST_STUDENTS_REQUEST, LIST_STUDENTS_SUCCESS } from '../constants/studentConstants';

export const listStudents = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_STUDENTS_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get('/api/students', config);

		dispatch({ type: LIST_STUDENTS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LIST_STUDENTS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
