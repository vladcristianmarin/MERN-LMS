import axios from 'axios';
import {
	COURSE_CREATE_FAIL,
	COURSE_CREATE_REQUEST,
	COURSE_CREATE_SUCCESS,
	COURSE_DELETE_FAIL,
	COURSE_DELETE_REQUEST,
	COURSE_DELETE_SUCCESS,
	COURSE_UPDATE_FAIL,
	COURSE_UPDATE_REQUEST,
	COURSE_UPDATE_SUCCESS,
	COURSE_UPLOAD_RESOURCE_FAIL,
	COURSE_UPLOAD_RESOURCE_REQUEST,
	COURSE_UPLOAD_RESOURCE_SUCCESS,
	FETCH_COURSE_FAIL,
	FETCH_COURSE_REQUEST,
	FETCH_COURSE_SUCCESS,
	LIST_COURSES_CLIENT_UPDATE,
	LIST_COURSES_FAIL,
	LIST_COURSES_REQUEST,
	LIST_COURSES_SUCCESS,
} from '../constants/courseConstants';

export const fetchCourse = (courseId) => async (dispatch, getState) => {
	try {
		dispatch({ type: FETCH_COURSE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get(`/api/courses/${courseId}`, config);

		dispatch({ type: FETCH_COURSE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: FETCH_COURSE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const listCourses = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_COURSES_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get('/api/courses', config);

		dispatch({ type: LIST_COURSES_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LIST_COURSES_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const createCourse = (name, acronym, teacher, description, weekday, hour) => async (dispatch, getState) => {
	try {
		dispatch({ type: COURSE_CREATE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post('/api/courses', { name, acronym, teacher, description, weekday, hour }, config);
		dispatch({ type: COURSE_CREATE_SUCCESS, payload: data });

		const courses = getState().courseList.courses || [];
		courses.push(data);
		dispatch({ type: LIST_COURSES_CLIENT_UPDATE, payload: courses });
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

		const courses = getState().courseList.courses || [];
		const updatedCourses = courses.filter((course) => !(course._id === data._id));
		dispatch({ type: LIST_COURSES_CLIENT_UPDATE, payload: updatedCourses });
	} catch (error) {
		dispatch({
			type: COURSE_DELETE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const updateCourse = (courseId, updates) => async (dispatch, getState) => {
	try {
		dispatch({
			type: COURSE_UPDATE_REQUEST,
		});

		const {
			userLogin: { authToken },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		};

		const { data } = await axios.patch(`/api/courses/${courseId}`, updates, config);
		dispatch({ type: COURSE_UPDATE_SUCCESS, payload: data });

		const courses = getState().courseList.courses || [];
		const courseIndex = courses.findIndex((course) => course._id === courseId);
		if (courseIndex > -1) {
			courses[courseIndex] = data;
			dispatch({ type: LIST_COURSES_CLIENT_UPDATE, payload: courses });
		}
	} catch (error) {
		dispatch({
			type: COURSE_UPDATE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const uploadResource = (courseId, title, description, file) => async (dispatch, getState) => {
	try {
		dispatch({
			type: COURSE_UPLOAD_RESOURCE_REQUEST,
		});

		const {
			userLogin: { authToken },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${authToken}`,
			},
		};

		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		formData.append('resource', file);

		await axios.post(`/api/courses/${courseId}/resources`, formData, config);
		dispatch({ type: COURSE_UPLOAD_RESOURCE_SUCCESS });
	} catch (error) {
		dispatch({
			type: COURSE_UPLOAD_RESOURCE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
