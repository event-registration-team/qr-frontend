import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as Partial<ApiError>;
    if (data.code && data.message) {
      return data as ApiError;
    }
    return {
      code: 'INTERNAL_ERROR',
      message: (data.message as string) || 'Произошла ошибка сервера',
    };
  }
  return {
    code: 'INTERNAL_ERROR',
    message: 'Не удалось подключиться к серверу',
  };
}
