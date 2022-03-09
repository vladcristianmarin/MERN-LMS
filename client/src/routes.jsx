import { useRoutes } from 'react-router-dom';
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Router = () => {
	return useRoutes([
		{
			path: '/',
			element: (
				<>
					<Header />
					<Sidebar />
				</>
			),
			children: [],
		},
		{
			path: '/login',
			element: <LoginScreen />,
		},
		{ path: '/register', element: <RegisterScreen /> },
	]);
};

export default Router;
