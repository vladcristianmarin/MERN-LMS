import axios from 'axios';
import {
	GROUP_ADD_STUDENTS_FAIL,
	GROUP_ADD_STUDENTS_REQUEST,
	GROUP_ADD_STUDENTS_SUCCESS,
	GROUP_CREATE_FAIL,
	GROUP_CREATE_REQUEST,
	GROUP_CREATE_SUCCESS,
	GROUP_DELETE_FAIL,
	GROUP_DELETE_REQUEST,
	GROUP_DELETE_SUCCESS,
	LIST_GROUPS_FAIL,
	LIST_GROUPS_REQUEST,
	LIST_GROUPS_SUCCESS,
} from '../constants/groupConstants';

export const createGroup = (code, school, yearOfStudy, students) => async (dispatch, getState) => {
	try {
		dispatch({ type: GROUP_CREATE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post('/api/groups', { code, school, yearOfStudy, students }, config);

		dispatch({ type: GROUP_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: GROUP_CREATE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const listGroups = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LIST_GROUPS_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.get('/api/groups', config);

		dispatch({ type: LIST_GROUPS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LIST_GROUPS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const deleteGroup = (groupId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GROUP_DELETE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.delete(`/api/groups/${groupId}`, config);

		dispatch({ type: GROUP_DELETE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: GROUP_DELETE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const addStudents = (groupId, students) => async (dispatch, getState) => {
	try {
		dispatch({ type: GROUP_ADD_STUDENTS_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post(`/api/groups/${groupId}`, { students }, config);

		dispatch({ type: GROUP_ADD_STUDENTS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: GROUP_ADD_STUDENTS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
