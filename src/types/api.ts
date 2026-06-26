export type RegistrationStatus = 'open' | 'closed';

export interface PublicEvent {
  id: number;
  title: string;
  description: string | null;
  location: string;
  start_at: string;
  end_at: string | null;
  registration_status: RegistrationStatus;
  max_participants: number;
  current_participants_count: number;
  require_phone: boolean;
  require_car_number: boolean;
}

export interface RegisterRequest {
  event_id: number;
  last_name: string;
  first_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  car_number?: string;
}

export interface Participant {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  email: string;
  event_id: number;
}

export interface RegisterResponse {
  message: string;
  qr_token: string;
  participant: Participant;
  // Бэк не отдаёт event — кладём на клиенте при навигации на success.
  event: {
    title: string;
    location: string;
    start_at: string;
  };
}

export interface ApiErrorBody {
  error: string;
}

export type ApiErrorKind =
  | 'event_not_found'
  | 'registration_closed_or_full'
  | 'email_already_registered'
  | 'validation_error'
  | 'internal_error';

export interface NormalizedApiError {
  kind: ApiErrorKind;
  message: string;
}
