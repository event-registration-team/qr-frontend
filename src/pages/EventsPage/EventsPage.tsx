import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../router/routes';
import { eventService, type ApiEvent } from '../../services/eventService';

import './EventsPage.css';

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusText(status: ApiEvent['registration_status']) {
  if (status === 'open') return 'Открыта';
  if (status === 'closed') return 'Закрыта';
  return 'Завершена';
}

export function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    eventService
      .getEvents()
      .then(setEvents)
      .catch(() => {
        setError('Не удалось загрузить мероприятия');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function handleDeleteEvent(id: number) {
    const isConfirmed = window.confirm('Удалить мероприятие?');

    if (!isConfirmed) {
      return;
    }

    try {
      await eventService.deleteEvent(id);

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== id),
      );
    } catch {
      setError('Не удалось удалить мероприятие');
    }
  }

  return (
    <section className="events-page">
      <div className="events-page__header">
        <div>
          <h1>Мероприятия</h1>
          <p>Управление мероприятиями системы</p>
        </div>

        <Link className="events-page__create" to={ROUTES.createEvent}>
          + Создать мероприятие
        </Link>
      </div>

      <div className="events-page__card">
        <div className="events-page__toolbar">
          <input type="text" placeholder="Поиск мероприятий..." />

          <select defaultValue="all">
            <option value="all">Все статусы</option>
            <option value="open">Открыта</option>
            <option value="closed">Закрыта</option>
            <option value="completed">Завершена</option>
          </select>
        </div>

        {isLoading && <p className="events-page__state">Загрузка мероприятий...</p>}

        {error && (
          <p className="events-page__state events-page__state--error">
            {error}
          </p>
        )}

        {!isLoading && !error && events.length === 0 && (
          <p className="events-page__state">Мероприятий пока нет</p>
        )}

        {!isLoading && !error && events.length > 0 && (
          <>
            <table className="events-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Дата проведения</th>
                  <th>Место</th>
                  <th>Регистрация</th>
                  <th>Действия</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="events-table__title">
                        <span>▣</span>
                        {event.title}
                      </div>
                    </td>

                    <td>{formatDate(event.start_at)}</td>
                    <td>{event.location}</td>

                    <td>
                      <span
                        className={
                          event.registration_status === 'open'
                            ? 'events-table__status events-table__status--open'
                            : 'events-table__status events-table__status--closed'
                        }
                      >
                        • {getStatusText(event.registration_status)}
                      </span>
                    </td>

                    <td>
                      <div className="events-table__actions">
                        <Link to={`/events/${event.id}/edit`}>
                          ✎ Редактировать
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          🗑 Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="events-page__footer">
              <span>Показано {events.length} мероприятий</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}