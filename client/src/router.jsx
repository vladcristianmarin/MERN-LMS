import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NotFoundScreen from './screens/NotFoundScreen';

const Router = () => {
	return useRoutes([
		{
			path: '/',
			element: <Dashboard />,
			children: [{ path: '', element: <HomeScreen /> }],
		},
		{ path: '/login', element: <LoginScreen /> },
		{ path: '/register', element: <RegisterScreen /> },
		{ path: '404', element: <NotFoundScreen /> },
		{ path: '*', element: <Navigate to='/404' replace /> },
	]);
};

export default Router;
