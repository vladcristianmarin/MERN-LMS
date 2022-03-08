import {
	HIDE_SIDEBAR_MENU,
	SHOW_SIDEBAR_MENU,
} from '../constants/sidebarConstants';

export const showSidebar = () => (dispatch) => {
	dispatch({ type: SHOW_SIDEBAR_MENU });
};

export const hideSidebar = () => (dispatch) => {
	dispatch({ type: HIDE_SIDEBAR_MENU });
};
