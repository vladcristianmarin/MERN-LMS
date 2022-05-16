import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import AdminStudentListScreen from './screens/AdminStudentListScreen';
import AdminTeacherListScreen from './screens/AdminTeacherListScreen';
import AdminGroupListScreen from './screens/AdminGroupListScreen';
import AdminCourseListScreen from './screens/AdminCourseListScreen';
import StudentCoursesScreen from './screens/StudentCoursesScreen';
import ChatScreen from './screens/ChatScreen';
import TeacherCoursesScreen from './screens/TeacherCoursesScreen';
import CourseResourcesScreen from './screens/CourseResourcesScreen';
import MeetingScreen from './screens/MeetingScreen';

const Router = () => {
	return useRoutes([
		{
			path: '/',
			element: <Dashboard />,
			children: [
				{ path: '', element: <HomeScreen /> },
				{ path: '/admin', element: <AdminHomeScreen /> },
				{ path: '/admin/students', element: <AdminStudentListScreen /> },
				{ path: '/admin/teachers', element: <AdminTeacherListScreen /> },
				{ path: '/admin/groups', element: <AdminGroupListScreen /> },
				{ path: '/admin/courses', element: <AdminCourseListScreen /> },
				{ path: '/student/courses', element: <StudentCoursesScreen /> },
				{ path: '/teacher/courses', element: <TeacherCoursesScreen /> },
				{ path: 'chat/:chatId', element: <ChatScreen /> },
				{ path: '/courses/:courseId', element: <CourseResourcesScreen /> },
				{ path: '/meeting/:meetingId', element: <MeetingScreen /> },
			],
		},
		{ path: '/login', element: <LoginScreen /> },
		{ path: '/register', element: <RegisterScreen /> },
		{ path: '/page-not-found', element: <NotFoundScreen /> },
		{ path: '*', element: <Navigate to='/page-not-found' replace /> },
	]);
};

export default Router;
