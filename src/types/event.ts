export interface ApiEvent {
  id: number;
  title: string;
  description?: string | null;
  location: string;
  start_at: string;
  end_at: string;
  registration_status: 'open' | 'closed' | 'completed';
  registration_link: string;
  max_participants?: number | null;
  materials_link?: string | null;
  require_phone: boolean;
  require_car_number: boolean;
  created_at?: string;
  updated_at?: string;
}