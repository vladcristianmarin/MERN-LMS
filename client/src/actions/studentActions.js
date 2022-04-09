import axios from 'axios';
import {
	LIST_STUDENTS_FAIL,
	LIST_STUDENTS_REQUEST,
	LIST_STUDENTS_SUCCESS,
	LIST_STUDENTS_UPDATE,
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

		const { data } = await axios.put(`/api/students/${studentId}/changeGroup`, { newGroup }, config);

		dispatch({
			type: STUDENT_CHANGE_GROUP_SUCCESS,
			payload: { name: data.student.name, newGroup: data.newGroup, oldGroup: data.oldGroup },
		});

		const { students } = getState().studentList;
		const modifiedStudentIndex = students.findIndex((stud) => stud._id === studentId);
		students[modifiedStudentIndex].group.code = newGroup;

		dispatch({ type: LIST_STUDENTS_UPDATE, payload: students });
	} catch (error) {
		dispatch({
			type: STUDENT_CHANGE_GROUP_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
