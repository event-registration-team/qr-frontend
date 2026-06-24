import { useEffect, useMemo, useState } from 'react';

import { eventService } from '../../services/eventService';
import { participantService } from '../../services/participantService';

import './ParticipantsPage.css';

type Participant = {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  email: string;
  phone?: string | null;
  car_number?: string | null;
  visit_status?: 'registered' | 'visited';
  registered_at?: string | null;
};

type EventItem = {
  id: number;
  title: string;
};

function getFullName(participant: Participant) {
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

export default function ParticipantsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registered' | 'visited'>('all');

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
    setError('');

    eventService
      .getEvents()
      .then((response: any) => {
        const list = response?.data ?? response;
        const safeList = Array.isArray(list) ? list : [];

        setEvents(safeList);

        if (safeList.length > 0) {
          setSelectedEventId(safeList[0].id);
        }
      })
      .catch(() => {
        setError('Не удалось загрузить мероприятия');
      });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    setIsLoading(true);
    setError('');

    participantService
      .getParticipantsByEventId(selectedEventId)
      .then((response: any) => {
        const list =
          response?.participants ??
          response?.data?.participants ??
          response?.data ??
          response;

        setParticipants(Array.isArray(list) ? list : []);
        setError('');
      })
      .catch(() => {
        setParticipants([]);
        setError('Не удалось загрузить участников');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedEventId]);

  const filteredParticipants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return participants.filter((participant) => {
      const fullName = getFullName(participant).toLowerCase();
      const email = participant.email.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || participant.visit_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [participants, search, statusFilter]);

  async function handleAddParticipant() {
    if (!selectedEventId) return;

    if (!form.last_name.trim() || !form.first_name.trim() || !form.email.trim()) {
      setError('Заполните фамилию, имя и email');
      return;
    }

    try {
      setError('');

      const response = await participantService.registerParticipant({
        event_id: selectedEventId,
        last_name: form.last_name.trim(),
        first_name: form.first_name.trim(),
        middle_name: form.middle_name.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        car_number: form.car_number.trim() || null,
      });

      const newParticipant = response?.participant ?? response;

      setParticipants((current) => [newParticipant, ...current]);

      setForm({
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
        car_number: '',
      });

      setIsModalOpen(false);
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

        <button
          type="button"
          className="participants-page__primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Добавить участника
        </button>
      </div>

      <div className="participants-page__card">
        <div className="participants-page__filters">
          <input
            type="text"
            placeholder="Поиск по ФИО или Email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={selectedEventId ?? ''}
            onChange={(event) => setSelectedEventId(Number(event.target.value))}
          >
            {events.length === 0 && <option value="">Нет мероприятий</option>}

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as 'all' | 'registered' | 'visited')
            }
          >
            <option value="all">Все участники</option>
            <option value="visited">Посетившие</option>
            <option value="registered">Не посетившие</option>
          </select>
        </div>

        {error && (
          <p className="participants-page__state participants-page__state--error">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="participants-page__state">Загрузка участников...</p>
        )}

        {!isLoading && !error && filteredParticipants.length === 0 && (
          <p className="participants-page__state">Участников пока нет</p>
        )}

        {!isLoading && filteredParticipants.length > 0 && (
          <>
            <div className="participants-page__table-wrap">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Авто</th>
                    <th>Дата регистрации</th>
                    <th>Статус</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id}>
                      <td>
                        <strong>{getFullName(participant)}</strong>
                      </td>
                      <td>{participant.email}</td>
                      <td>{participant.phone || 'Не указан'}</td>
                      <td>{participant.car_number || 'Не указан'}</td>
                      <td>{formatDate(participant.registered_at)}</td>
                      <td>
                        <span
                          className={
                            participant.visit_status === 'visited'
                              ? 'participants-status participants-status--visited'
                              : 'participants-status'
                          }
                        >
                          {participant.visit_status === 'visited'
                            ? 'Посетил'
                            : 'Зарегистрирован'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="participants-page__footer">
              <span>Показано {filteredParticipants.length} участников</span>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div
          className="participants-modal"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="participants-modal__content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="participants-modal__header">
              <div>
                <h2>Добавить участника</h2>
                <p>Заполните данные регистрации</p>
              </div>

              <button
                type="button"
                className="participants-modal__close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="participants-modal__grid">
              <label>
                Фамилия *
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(event) =>
                    setForm({ ...form, last_name: event.target.value })
                  }
                />
              </label>

              <label>
                Имя *
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(event) =>
                    setForm({ ...form, first_name: event.target.value })
                  }
                />
              </label>

              <label>
                Отчество
                <input
                  type="text"
                  value={form.middle_name}
                  onChange={(event) =>
                    setForm({ ...form, middle_name: event.target.value })
                  }
                />
              </label>

              <label>
                Email *
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
              </label>

              <label>
                Телефон
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                />
              </label>

              <label>
                Авто
                <input
                  type="text"
                  value={form.car_number}
                  onChange={(event) =>
                    setForm({ ...form, car_number: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="participants-modal__actions">
              <button
                type="button"
                className="participants-modal__cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>

              <button
                type="button"
                className="participants-modal__submit"
                onClick={handleAddParticipant}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}