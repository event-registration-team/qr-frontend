import type { PublicEvent, RegisterRequest, RegisterResponse } from '../types/api';

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

const MOCK_BASE = {
  id: '1',
  title: 'TechConf 2024',
  location: 'Москва, Центр Экспо',
  startAt: '2024-12-15T10:00:00Z',
};

const MOCK_EVENTS: Record<string, PublicEvent> = {
  'test-open': {
    ...MOCK_BASE,
    registrationStatus: 'open',
    isFull: false,
    requirePhone: true,
    requireCarNumber: true,
  },
  'test-closed': {
    ...MOCK_BASE,
    registrationStatus: 'closed',
    isFull: false,
    requirePhone: true,
    requireCarNumber: true,
  },
  'test-full': {
    ...MOCK_BASE,
    registrationStatus: 'open',
    isFull: true,
    requirePhone: true,
    requireCarNumber: true,
  },
  'test-no-extra': {
    ...MOCK_BASE,
    registrationStatus: 'open',
    isFull: false,
    requirePhone: false,
    requireCarNumber: false,
  },
};

export async function mockGetPublicEvent(token: string): Promise<PublicEvent> {
  await delay(600);
  const event = MOCK_EVENTS[token];
  if (!event) {
    throw { code: 'EVENT_NOT_FOUND', message: 'Мероприятие не найдено' };
  }
  return event;
}

export async function mockRegisterParticipant(
  token: string,
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  await delay(600);
  const event = MOCK_EVENTS[token];
  if (!event) {
    throw { code: 'EVENT_NOT_FOUND', message: 'Мероприятие не найдено' };
  }
  if (event.registrationStatus === 'closed') {
    throw { code: 'REGISTRATION_CLOSED', message: 'Регистрация на мероприятие закрыта' };
  }
  if (event.isFull) {
    throw { code: 'EVENT_FULL', message: 'Все места заняты' };
  }
  if (payload.email === 'taken@example.com') {
    throw { code: 'EMAIL_ALREADY_REGISTERED', message: 'Этот email уже зарегистрирован' };
  }
  const participantId = `mock-${Date.now()}`;
  return {
    participantId,
    qrToken: `qr-${participantId}`,
    qrImageDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=MOCK-${participantId}`,
    participant: {
      lastName: payload.lastName,
      firstName: payload.firstName,
      middleName: payload.middleName,
      email: payload.email,
    },
    event: {
      title: event.title,
      location: event.location,
      startAt: event.startAt,
    },
  };
}
