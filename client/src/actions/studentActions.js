import axios from 'axios';
import {
	LIST_STUDENTS_CLIENT_UPDATE,
	LIST_STUDENTS_FAIL,
	LIST_STUDENTS_REQUEST,
	LIST_STUDENTS_SUCCESS,
	STUDENT_CHANGE_GROUP_FAIL,
	STUDENT_CHANGE_GROUP_REQUEST,
	STUDENT_CHANGE_GROUP_SUCCESS,
	STUDENT_MY_COURSES_FAIL,
	STUDENT_MY_COURSES_REQUEST,
	STUDENT_MY_COURSES_SUCCESS,
	STUDENT_MY_GROUP_FAIL,
	STUDENT_MY_GROUP_REQUEST,
	STUDENT_MY_GROUP_SUCCESS,
} from '../constants/studentConstants';

export const getMyGroup = () => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_MY_GROUP_REQUEST });
		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };
		const { data } = await axios.get('/api/students/mygroup', config);
		dispatch({
			type: STUDENT_MY_GROUP_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: STUDENT_MY_GROUP_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const getMyCourses = () => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_MY_COURSES_REQUEST });
		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };
		const { data } = await axios.get('/api/students/mycourses', config);
		dispatch({
			type: STUDENT_MY_COURSES_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: STUDENT_MY_COURSES_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

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

		const students = getState().studentList.students || [];
		const studentIndex = students.findIndex((stud) => stud._id === studentId);
		if (studentIndex > -1) {
			students[studentIndex].group.code = data.newGroup;
			dispatch({ type: LIST_STUDENTS_CLIENT_UPDATE, payload: students });
		}
	} catch (error) {
		dispatch({
			type: STUDENT_CHANGE_GROUP_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
