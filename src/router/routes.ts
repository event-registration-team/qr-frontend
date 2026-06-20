export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  events: '/events',
  createEvent: '/events/create',
  editEvent: '/events/:id/edit',
  participants: '/participants',
  statistics: '/statistics',
  importExport: '/import-export',
  register: '/register/:eventToken',
  registerClosed: '/register/:eventToken/closed',
  registerSuccess: '/register/:eventToken/success',
} as const;