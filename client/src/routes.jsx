import { Navigate, useRoutes } from 'react-router-dom';
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NotFoundScreen from './screens/NotFoundScreen';

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
      children: []
    },
    { path: '/login', element: <LoginScreen /> },
    { path: '/404', element: <NotFoundScreen /> },
    { path: '/register', element: <RegisterScreen /> },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
};

export default Router;
