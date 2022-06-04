import axios from 'axios';
import {
	EXAM_CREATE_FAIL,
	EXAM_CREATE_REQUEST,
	EXAM_CREATE_SUCCESS,
	LIST_STUDENT_EXAMS_FAIL,
	LIST_STUDENT_EXAMS_REQUEST,
	LIST_STUDENT_EXAMS_SUCCESS,
} from '../constants/examConstants';

export const createExam = (title, description, course, date, timer, questions) => async (dispatch, getState) => {
	try {
		dispatch({ type: EXAM_CREATE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post('/api/exams', { title, description, course, date, timer, questions }, config);
		dispatch({ type: EXAM_CREATE_SUCCESS, payload: data });

		// const courses = getState().courseList.courses || [];
		// courses.push(data);
		// dispatch({ type: LIST_COURSES_CLIENT_UPDATE, payload: courses });
	} catch (error) {
		dispatch({
			type: EXAM_CREATE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const listExamsStudent = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_STUDENT_EXAMS_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get('/api/exams/student', config);
		dispatch({ type: LIST_STUDENT_EXAMS_SUCCESS, payload: data });

		// const courses = getState().courseList.courses || [];
		// courses.push(data);
		// dispatch({ type: LIST_COURSES_CLIENT_UPDATE, payload: courses });
	} catch (error) {
		dispatch({
			type: LIST_STUDENT_EXAMS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
