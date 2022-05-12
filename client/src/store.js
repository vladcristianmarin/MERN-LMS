import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sidebarReducer } from './reducers/sidebarReducers';
import { userLoginReducer, userMakeAdminReducer, userRegisterReducer } from './reducers/userReducers';
import {
	courseCreateReducer,
	courseDeleteReducer,
	courseFetchReducer,
	courseListReducer,
	courseListResourcesReducer,
	courseUpdateReducer,
	courseUploadResourceReducer,
} from './reducers/courseReducers';
import { teacherListCoursesReducer, teacherListReducer, teacherMyCoursesReducer } from './reducers/teacherReducers';
import {
	groupAddStudentsReducer,
	groupCreateReducer,
	groupDeleteReducer,
	groupEnrollCourseReducer,
	groupListReducer,
	groupRemoveCourseReducer,
	groupRemoveStudentReducer,
	groupUpdateReducer,
} from './reducers/groupReducers';
import {
	studentChangeGroupReducer,
	studentListReducer,
	studentMyCoursesReducer,
	studentMyGroupReducer,
} from './reducers/studentReducers';
import {
	chatInfoReducer,
	chatListReducer,
	messagesListReduces,
	selectedChatReducer,
	sendMessageReducer,
} from './reducers/chatReducers';

const reducer = combineReducers({
	sidebar: sidebarReducer,
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userMakeAdmin: userMakeAdminReducer,
	courseFetch: courseFetchReducer,
	courseCreate: courseCreateReducer,
	courseDelete: courseDeleteReducer,
	courseUpdate: courseUpdateReducer,
	courseList: courseListReducer,
	courseListResources: courseListResourcesReducer,
	courseUploadResource: courseUploadResourceReducer,
	groupCreate: groupCreateReducer,
	groupAddStudents: groupAddStudentsReducer,
	groupRemoveStudent: groupRemoveStudentReducer,
	groupDelete: groupDeleteReducer,
	groupUpdate: groupUpdateReducer,
	groupList: groupListReducer,
	groupEnrollCourse: groupEnrollCourseReducer,
	groupRemoveCourse: groupRemoveCourseReducer,
	teacherList: teacherListReducer,
	teacherListCourses: teacherListCoursesReducer,
	teacherMyCourses: teacherMyCoursesReducer,
	studentList: studentListReducer,
	studentMyGroup: studentMyGroupReducer,
	studentMyCourses: studentMyCoursesReducer,
	studentChangeGroup: studentChangeGroupReducer,
	chatList: chatListReducer,
	chatMessages: messagesListReduces,
	sendMessage: sendMessageReducer,
	selectedChat: selectedChatReducer,
	chatInfo: chatInfoReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const authTokenFromStorage = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null;

const initialState = {
	sidebar: { isOpen: false },
	userLogin: { userInfo: userInfoFromStorage, authToken: authTokenFromStorage },
	teacherList: { teachers: [] },
	studentList: { students: [] },
	groupList: { groups: [] },
	courseList: { courses: [] },
	courseListResources: { resources: [] },
	teacherListCourses: { courses: [] },
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
