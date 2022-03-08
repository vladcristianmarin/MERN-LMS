import {
	HIDE_SIDEBAR_MENU,
	SHOW_SIDEBAR_MENU,
} from '../constants/sidebarConstants';

export const sidebarReducer = (state = { isSidebarVisible: false }, action) => {
	switch (action.type) {
		case SHOW_SIDEBAR_MENU:
			return { isSidebarVisible: true };
		case HIDE_SIDEBAR_MENU:
			return { isSidebarVisible: false };
		default:
			return state;
	}
};
