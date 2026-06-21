import { useEffect, useState } from 'react';

import { eventService, type ApiEvent } from '../../services/eventService';
import {
  participantService,
  type ApiParticipant,
} from '../../services/participantService';

import './ParticipantsPage.css';

function getFullName(participant: ApiParticipant) {
  return [
    participant.last_name,
    participant.first_name,
    participant.middle_name,
  ]
    .filter(Boolean)
    .join(' ');
}

function formatDate(value?: string | null) {
  if (!value) return '—';

  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ParticipantsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<ApiParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    email: '',
    phone: '',
    car_number: '',
  });

  useEffect(() => {
    eventService
      .getEvents()
      .then((loadedEvents) => {
        setEvents(loadedEvents);

        if (loadedEvents.length > 0) {
          setSelectedEventId(loadedEvents[0].id);
        }
      })
      .catch(() => {
        setError('Не удалось загрузить мероприятия');
      });
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    participantService
      .getParticipantsByEventId(selectedEventId)
      .then(setParticipants)
      .catch(() => {
        setError('Не удалось загрузить участников');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedEventId]);

  async function handleAddParticipant() {
    if (!selectedEventId) return;

    try {
      const result = await participantService.registerParticipant({
        event_id: selectedEventId,
        last_name: form.last_name,
        first_name: form.first_name,
        middle_name: form.middle_name || null,
        email: form.email,
        phone: form.phone || null,
        car_number: form.car_number || null,
      });

      setParticipants((prev) => [result.participant, ...prev]);
      setIsModalOpen(false);

      setForm({
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
        car_number: '',
      });
    } catch {
      setError('Не удалось добавить участника');
    }
  }

  return (
    <section className="participants-page">
      <div className="participants-page__header">
        <div>
          <h1>Участники</h1>
          <p>Управление зарегистрированными участниками</p>
        </div>

        <div className="participants-page__actions">
          <button type="button" className="participants-page__secondary">
            Импорт
          </button>

          <button type="button" className="participants-page__primary">
            Экспорт
          </button>

          <button
            type="button"
            className="participants-page__primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Добавить участника
          </button>
        </div>
      </div>

      <div className="participants-page__card">
        <div className="participants-page__filters">
          <input type="text" placeholder="Поиск по ФИО или Email..." />

          <select
            value={selectedEventId ?? ''}
            onChange={(e) => setSelectedEventId(Number(e.target.value))}
          >
            {events.length === 0 && <option value="">Нет мероприятий</option>}

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <select defaultValue="all">
            <option value="all">Все участники</option>
            <option value="visited">Посетившие</option>
            <option value="registered">Не посетившие</option>
          </select>
        </div>

        {isLoading && (
          <p className="participants-page__state">Загрузка участников...</p>
        )}

        {error && (
          <p className="participants-page__state participants-page__state--error">
            {error}
          </p>
        )}

        {!isLoading && !error && participants.length === 0 && (
          <p className="participants-page__state">Участников пока нет</p>
        )}

        {!isLoading && !error && participants.length > 0 && (
          <>
            <table className="participants-table">
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Авто</th>
                  <th>Дата регистрации</th>
                  <th>Статус</th>
                  <th>Время прохода</th>
                </tr>
              </thead>

              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{getFullName(p)}</strong>
                    </td>
                    <td>{p.email}</td>
                    <td>{p.phone || 'Не указан'}</td>
                    <td>{p.car_number || 'Не указан'}</td>
                    <td>{formatDate(p.registered_at)}</td>
                    <td>
                      <span
                        className={
                          p.visit_status === 'visited'
                            ? 'participants-status participants-status--visited'
                            : 'participants-status'
                        }
                      >
                        {p.visit_status === 'visited'
                          ? 'Посетил'
                          : 'Зарегистрирован'}
                      </span>
                    </td>
                    <td>{formatDate(p.checked_in_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="participants-page__footer">
              <span>Показано {participants.length} участников</span>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <h3>Добавить участника</h3>

            <input
              placeholder="Фамилия *"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />

            <input
              placeholder="Имя *"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />

            <input
              placeholder="Отчество"
              value={form.middle_name}
              onChange={(e) =>
                setForm({ ...form, middle_name: e.target.value })
              }
            />

            <input
              placeholder="Email *"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              placeholder="Телефон"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              placeholder="Авто"
              value={form.car_number}
              onChange={(e) =>
                setForm({ ...form, car_number: e.target.value })
              }
            />

            <div className="modal__actions">
              <button onClick={() => setIsModalOpen(false)}>
                Отмена
              </button>

              <button onClick={handleAddParticipant}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}