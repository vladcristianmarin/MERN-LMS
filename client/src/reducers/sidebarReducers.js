import { HIDE_SIDEBAR, SHOW_SIDEBAR } from '../constants/sidebarConstants';

export const sidebarReducer = (state = { isOpen: true }, action) => {
	switch (action.type) {
		case SHOW_SIDEBAR:
			return { isOpen: true };
		case HIDE_SIDEBAR:
			return { isOpen: false };
		default:
			return state;
	}
};
