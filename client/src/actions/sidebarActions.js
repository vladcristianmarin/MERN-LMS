import { HIDE_SIDEBAR, SHOW_SIDEBAR } from '../constants/sidebarConstants';

export const showSidebar = () => (dispatch) => {
	dispatch({ type: SHOW_SIDEBAR });
};
export const hideSidebar = () => (dispatch) => {
	dispatch({ type: HIDE_SIDEBAR });
};
