import axios, { AxiosError } from 'axios';
import type { ApiErrorBody, NormalizedApiError } from '../types/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    const data = error.response.data as Partial<ApiErrorBody>;
    const serverMessage = data?.error;

    switch (status) {
      case 404:
        return { kind: 'event_not_found', message: serverMessage || 'Мероприятие не найдено' };
      case 409:
        return {
          kind: 'email_already_registered',
          message: serverMessage || 'Этот email уже зарегистрирован',
        };
      case 403:
        return {
          kind: 'registration_closed_or_full',
          message: serverMessage || 'Регистрация недоступна',
        };
      case 400:
        return {
          kind: 'validation_error',
          message: serverMessage || 'Проверьте корректность введённых данных',
        };
      default:
        return { kind: 'internal_error', message: serverMessage || 'Произошла ошибка сервера' };
    }
  }
  return { kind: 'internal_error', message: 'Не удалось подключиться к серверу' };
}
