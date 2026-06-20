export type EventRegistrationStatus = 'open' | 'closed' | 'completed';

export interface PublicEvent {
  id: string;
  title: string;
  description?: string;
  location: string;
  startAt: string;
  endAt?: string;
  registrationStatus: EventRegistrationStatus;
  isFull: boolean;
  requirePhone: boolean;
  requireCarNumber: boolean;
}

export interface RegisterRequest {
  lastName: string;
  firstName: string;
  middleName?: string;
  email: string;
  phone?: string;
  carNumber?: string;
}

export interface RegisterResponse {
  participantId: string;
  qrToken: string;
  qrImageDataUrl?: string;
  participant: {
    lastName: string;
    firstName: string;
    middleName?: string;
    email: string;
  };
  event: {
    title: string;
    location: string;
    startAt: string;
  };
}

export interface ApiError {
  code:
    | 'EVENT_NOT_FOUND'
    | 'REGISTRATION_CLOSED'
    | 'EVENT_FULL'
    | 'EMAIL_ALREADY_REGISTERED'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_ERROR';
  message: string;
  fields?: Record<string, string>;
}
