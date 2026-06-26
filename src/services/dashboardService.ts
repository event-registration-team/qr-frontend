import { api } from './api';

export interface DashboardStats {
  total_events: number;
  events_this_month: number;
  total_participants: number;
  participants_this_week: number;
  total_visited: number;
  attendance_rate: number;
}

export const dashboardService = {
  async getStats() {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
