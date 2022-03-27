import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sidebarReducer } from './reducers/sidebarReducers';
import { userLoginReducer, userMakeAdminReducer, userRegisterReducer } from './reducers/userReducers';
import { courseCreateReducer, courseDeleteReducer } from './reducers/courseReducers';
import { teacherListCoursesReducer, teacherListReducer } from './reducers/teacherReducers';
import { groupCreateReducer } from './reducers/groupReducers';
import { studentListReducer } from './reducers/studentReducers';

const reducer = combineReducers({
	sidebar: sidebarReducer,
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userMakeAdmin: userMakeAdminReducer,
	courseCreate: courseCreateReducer,
	courseDelete: courseDeleteReducer,
	groupCreate: groupCreateReducer,
	teacherList: teacherListReducer,
	teacherListCourses: teacherListCoursesReducer,
	studentList: studentListReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const authTokenFromStorage = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null;

const initialState = {
	sidebar: { isOpen: true },
	userLogin: { userInfo: userInfoFromStorage, authToken: authTokenFromStorage },
	teacherList: { teachers: [] },
	studentList: { students: [] },
	teacherListCourses: { courses: [] },
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
