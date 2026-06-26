import { api } from './api';

export type ApiParticipant = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  email: string;
  phone?: string | null;
  car_number?: string | null;
  visit_status: 'visited' | 'registered';
  registered_at?: string | null;
  checked_in_at?: string | null;
};

export type CreateParticipant = {
  event_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  email: string;
  phone?: string | null;
  car_number?: string | null;
};

function normalizeParticipants(response: any): ApiParticipant[] {
  const data =
    response?.participants ??
    response?.data?.participants ??
    response?.data ??
    response;

  return Array.isArray(data) ? data : [];
}

export const participantService = {
  async getParticipantsByEventId(eventId: number): Promise<ApiParticipant[]> {
    const response = await api.get(`/participants/event?event_id=${eventId}`);
    return normalizeParticipants(response.data);
  },

  async registerParticipant(
    payload: CreateParticipant,
  ): Promise<{ participant: ApiParticipant }> {
    const response = await api.post<{ participant: ApiParticipant }>(
      '/participants/register',
      payload,
    );

    return response.data;
  },

  async deleteParticipant(id: number): Promise<void> {
    await api.delete(`/participants/${id}`);
  },

  async updateParticipant(
    id: number,
    data: Partial<ApiParticipant>,
  ): Promise<{ participant: ApiParticipant }> {
    const response = await api.patch<{ participant: ApiParticipant }>(
      `/participants/${id}`,
      data,
    );

    return response.data;
  },
};