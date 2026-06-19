export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  events: '/events',
  createEvent: '/events/create',
  editEvent: '/events/:id/edit',
  participants: '/events/:id/participants',
  statistics: '/events/:id/statistics',
  importExport: '/events/:id/import-export',
} as const;