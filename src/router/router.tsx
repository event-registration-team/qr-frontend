import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout/AdminLayout';

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
    element: <AdminLayout />,

    children: [

      {
        path: ROUTES.dashboard,

        element: <DashboardPage />,
      },

    ],

  },

]);