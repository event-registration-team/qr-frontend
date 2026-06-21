import { api } from './api';

export interface ApiEvent {
  id: number;
  title: string;
  description?: string | null;
  location: string;
  start_at: string;
  end_at: string;
  registration_status: 'open' | 'closed' | 'completed';
  registration_link?: string;
  max_participants?: number | null;
  materials_link?: string | null;
  require_phone: boolean;
  require_car_number: boolean;
}

export interface CreateEventPayload {
  title: string;
  description?: string | null;
  location: string;
  start_at: string;
  end_at: string;
  max_participants?: number | null;
  materials_link?: string | null;
  require_phone: boolean;
  require_car_number: boolean;
  registration_link: string;
}

export const eventService = {
  async getEvents() {
    const response = await api.get<ApiEvent[] | null>('/events');
    return response.data ?? [];
  },

  async createEvent(payload: CreateEventPayload) {
    const response = await api.post<ApiEvent>('/events', payload);
    return response.data;
  },

  async deleteEvent(id: number) {
    await api.delete(`/events/${id}`);
  },

  async getEventById(id: number) {
  const response = await api.get<ApiEvent>(`/events/${id}`);
  return response.data;
},

async updateEvent(id: number, payload: Partial<CreateEventPayload>) {
  const response = await api.patch<ApiEvent>(`/events/${id}`, payload);
  return response.data;
},
};