import type { Participant, PublicEvent, RegisterRequest } from '../types/api';
import { apiClient, normalizeApiError } from './client';

export async function getEvent(id: number): Promise<PublicEvent> {
  try {
    const res = await apiClient.get<PublicEvent>(`/events/${id}`);
    return res.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function registerParticipant(
  payload: RegisterRequest,
): Promise<{ qr_token: string; participant: Participant; message: string }> {
  try {
    const res = await apiClient.post<{
      qr_token: string;
      participant: Participant;
      message: string;
    }>('/participants/register', payload);
    return res.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export function getQrcodeUrl(participantId: number): string {
  return `/api/participants/${participantId}/qrcode`;
}
