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
	GROUP_ENROLL_COURSE_FAIL,
	GROUP_ENROLL_COURSE_REQUEST,
	GROUP_ENROLL_COURSE_SUCCESS,
	GROUP_REMOVE_COURSE_FAIL,
	GROUP_REMOVE_COURSE_REQUEST,
	GROUP_REMOVE_COURSE_SUCCESS,
	GROUP_REMOVE_STUDENT_FAIL,
	GROUP_REMOVE_STUDENT_REQUEST,
	GROUP_REMOVE_STUDENT_SUCCESS,
	GROUP_UPDATE_FAIL,
	GROUP_UPDATE_REQUEST,
	GROUP_UPDATE_SUCCESS,
	LIST_GROUPS_CLIENT_UPDATE,
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

		const groups = getState().groupList.groups || [];
		groups.push(data);
		dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: groups });
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

		const groups = getState().groupList.groups || [];
		const updatedGroups = groups.filter((group) => !(group._id === data._id));
		dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: updatedGroups });
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

		const groups = getState().groupList.groups || [];
		const groupIndex = groups.findIndex((group) => group._id === groupId);
		if (groupIndex > -1) {
			groups[groupIndex] = { ...groups[groupIndex], students: data.students };
			dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: groups });
		}
	} catch (error) {
		dispatch({
			type: GROUP_ADD_STUDENTS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const removeStudent = (groupId, studentId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GROUP_REMOVE_STUDENT_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.delete(`/api/groups/${groupId}/students/${studentId}`, config);
		dispatch({ type: GROUP_REMOVE_STUDENT_SUCCESS, payload: data });

		const groups = getState().groupList.groups || [];
		const groupIndex = groups.findIndex((group) => group._id === groupId);
		if (groupIndex > -1) {
			groups[groupIndex].students = groups[groupIndex].students.filter((stud) => !(stud._id === studentId));
			dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: groups });
		}
	} catch (error) {
		dispatch({
			type: GROUP_REMOVE_STUDENT_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const enrollCourse = (groupId, courseId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GROUP_ENROLL_COURSE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.post(`/api/groups/${groupId}/courses`, { courseId }, config);
		dispatch({ type: GROUP_ENROLL_COURSE_SUCCESS, payload: data.updatedGroup });

		const groups = getState().groupList.groups || [];
		const groupIndex = groups.findIndex((group) => group._id === groupId);
		if (groupIndex > -1) {
			groups[groupIndex].courses.push(data.course);
			dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: groups });
		}
	} catch (error) {
		dispatch({
			type: GROUP_ENROLL_COURSE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const removeCourse = (groupId, courseId) => async (dispatch, getState) => {
	try {
		dispatch({ type: GROUP_REMOVE_COURSE_REQUEST });

		const {
			userLogin: { authToken },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${authToken}` } };

		const { data } = await axios.delete(`/api/groups/${groupId}/courses/${courseId}`, config);
		dispatch({ type: GROUP_REMOVE_COURSE_SUCCESS, payload: data.updatedGroup });

		const groups = getState().groupList.groups || [];
		const groupIndex = groups.findIndex((group) => group._id === groupId);
		if (groupIndex > -1) {
			groups[groupIndex].courses = groups[groupIndex].courses.filter((course) => course._id !== data.course._id);
			dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: groups });
		}
	} catch (error) {
		dispatch({
			type: GROUP_REMOVE_COURSE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const updateGroup = (groupId, updates) => async (dispatch, getState) => {
	try {
		dispatch({
			type: GROUP_UPDATE_REQUEST,
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

		const { data } = await axios.patch(`/api/groups/${groupId}`, updates, config);
		dispatch({ type: GROUP_UPDATE_SUCCESS, payload: data });

		const groups = getState().groupList.groups || [];
		const groupIndex = groups.findIndex((group) => group._id === groupId);
		if (groupIndex > -1) {
			groups[groupIndex].code = data.code;
			groups[groupIndex].school = data.school;
			groups[groupIndex].yearOfStudy = data.yearOfStudy;
			dispatch({ type: LIST_GROUPS_CLIENT_UPDATE, payload: groups });
		}
	} catch (error) {
		dispatch({
			type: GROUP_UPDATE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
