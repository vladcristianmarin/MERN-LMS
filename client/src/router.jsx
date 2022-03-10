import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NotFoundScreen from './screens/NotFoundScreen';

const Router = () => {
	return useRoutes([
		{
			path: '/',
			element: (
				<>
					<Header /> <Sidebar />
					<Outlet />
				</>
			),
			children: [{ path: '', element: <HomeScreen /> }],
		},
		{ path: '/login', element: <LoginScreen /> },
		{ path: '/register', element: <RegisterScreen /> },
		{ path: '404', element: <NotFoundScreen /> },
		{ path: '*', element: <Navigate to='/404' replace /> },
	]);
};

export default Router;
