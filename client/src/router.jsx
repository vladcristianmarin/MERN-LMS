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
			],
		},
		{ path: '/login', element: <LoginScreen /> },
		{ path: '/register', element: <RegisterScreen /> },
		{ path: '404', element: <NotFoundScreen /> },
		{ path: '*', element: <Navigate to='/404' replace /> },
	]);
};

export default Router;
