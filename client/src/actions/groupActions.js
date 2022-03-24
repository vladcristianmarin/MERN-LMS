import axios from 'axios';
import { GROUP_CREATE_FAIL, GROUP_CREATE_REQUEST, GROUP_CREATE_SUCCESS } from '../constants/groupConstants';

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