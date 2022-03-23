import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sidebarReducer } from './reducers/sidebarReducers';
import { userLoginReducer, userRegisterReducer } from './reducers/userReducers';
import { courseCreateReducer } from './reducers/courseReducers';
import { teacherListReducer } from './reducers/teacherReducers';

const reducer = combineReducers({
	sidebar: sidebarReducer,
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	courseCreate: courseCreateReducer,
	teacherList: teacherListReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const authTokenFromStorage = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null;

const inititalState = {
	sidebar: { isOpen: true },
	userLogin: { userInfo: userInfoFromStorage, authToken: authTokenFromStorage },
	teacherList: { teachers: [] },
};

const middleware = [thunk];

const store = createStore(reducer, inititalState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
