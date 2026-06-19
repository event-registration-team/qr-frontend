import { createBrowserRouter, Navigate } from 'react-router-dom';

import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.dashboard} replace />,
  },

  {
    path: ROUTES.login,
    element: <LoginPage />,
  },

  {
    path: ROUTES.dashboard,
    element: <DashboardPage />,
  },
]);