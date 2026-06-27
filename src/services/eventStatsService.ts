import { api } from './api';

export interface EventStats {
  total: number;
  visited: number;
  absent: number;
}

export interface HourlyStat {
  hour: string;
  count: number;
}

export const eventStatsService = {
  async getEventStats(id: number) {
    const response = await api.get<EventStats>(`/events/${id}/stats`);
    return response.data;
  },

  async getHourlyStats(id: number) {
    const response = await api.get<HourlyStat[]>(`/events/${id}/stats/hourly`);
    return response.data ?? [];
  },
};
