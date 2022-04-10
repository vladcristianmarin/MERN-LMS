import axios from 'axios';
import {
	LIST_STUDENTS_FAIL,
	LIST_STUDENTS_REQUEST,
	LIST_STUDENTS_SUCCESS,
	STUDENT_CHANGE_GROUP_FAIL,
	STUDENT_CHANGE_GROUP_REQUEST,
	STUDENT_CHANGE_GROUP_SUCCESS,
} from '../constants/studentConstants';

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

export const changeGroup = (studentId, newGroup) => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_CHANGE_GROUP_REQUEST });
		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.patch(`/api/students/${studentId}/changeGroup`, { newGroup }, config);

		dispatch({
			type: STUDENT_CHANGE_GROUP_SUCCESS,
			payload: { name: data.student.name, newGroup: data.newGroup, oldGroup: data.oldGroup },
		});
	} catch (error) {
		dispatch({
			type: STUDENT_CHANGE_GROUP_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
