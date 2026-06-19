import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout/AdminLayout';

import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { EventFormPage } from '../pages/EventFormPage/EventFormPage';
import { EventsPage } from '../pages/EventsPage/EventsPage';
import { ImportExportPage } from '../pages/ImportExportPage/ImportExportPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { ParticipantsPage } from '../pages/ParticipantsPage/ParticipantsPage';
import { StatisticsPage } from '../pages/StatisticsPage/StatisticsPage';

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
      {
        path: ROUTES.events,
        element: <EventsPage />,
      },
      {
        path: ROUTES.createEvent,
        element: <EventFormPage mode="create" />,
      },
      {
        path: ROUTES.editEvent,
        element: <EventFormPage mode="edit" />,
      },
      {
        path: ROUTES.participants,
        element: <ParticipantsPage />,
      },
      {
        path: ROUTES.statistics,
        element: <StatisticsPage />,
      },
      {
        path: ROUTES.importExport,
        element: <ImportExportPage />,
      },
    ],
  },
]);