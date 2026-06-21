import { api } from './api';

export interface ApiParticipant {
  id: number;
  event_id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  email: string;
  phone?: string | null;
  car_number?: string | null;
  qr_token: string;
  visit_status: 'registered' | 'visited';
  registered_at: string;
  checked_in_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateParticipantPayload {
  event_id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  email: string;
  phone?: string | null;
  car_number?: string | null;
}

export const participantService = {
  async getParticipantsByEventId(eventId: number) {
    const response = await api.get<ApiParticipant[] | null>(
      `/participants/event?event_id=${eventId}`,
    );

    return response.data ?? [];
  },

  async registerParticipant(payload: CreateParticipantPayload) {
    const response = await api.post<{
      message: string;
      qr_token: string;
      participant: ApiParticipant;
    }>('/participants/register', payload);

    return response.data;
  },
};