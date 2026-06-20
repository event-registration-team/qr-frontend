import type { PublicEvent, RegisterRequest, RegisterResponse } from '../types/api';
import { apiClient, normalizeApiError } from './client';
import { mockGetPublicEvent, mockRegisterParticipant } from './mocks';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function getPublicEvent(token: string): Promise<PublicEvent> {
  if (USE_MOCKS) {
    return mockGetPublicEvent(token);
  }
  try {
    const res = await apiClient.get<PublicEvent>(`/public/events/${token}`);
    return res.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function registerParticipant(
  token: string,
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  if (USE_MOCKS) {
    return mockRegisterParticipant(token, payload);
  }
  try {
    const res = await apiClient.post<RegisterResponse>(
      `/public/events/${token}/register`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
