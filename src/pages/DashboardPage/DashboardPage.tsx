import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { eventService, type ApiEvent } from '../../services/eventService';
import { eventStatsService, type EventStats, type HourlyStat } from '../../services/eventStatsService';
import { StatsCard } from '../../components/StatsCard/StatsCard';
import { ROUTES } from '../../router/routes';

import './DashboardPage.css';

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [hourlyStats, setHourlyStats] = useState<HourlyStat[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setData)
      .catch(() => {
        setError('Не удалось загрузить статистику');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    eventService.getEvents().then((list) => {
      setEvents(list);
      if (list.length > 0) {
        setSelectedEventId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    setIsLoadingAnalytics(true);
    Promise.all([
      eventStatsService.getEventStats(selectedEventId),
      eventStatsService.getHourlyStats(selectedEventId),
    ])
      .then(([stats, hourly]) => {
        setEventStats(stats);
        setHourlyStats(hourly);
      })
      .catch(() => {})
      .finally(() => setIsLoadingAnalytics(false));
  }, [selectedEventId]);

  return (
    <section className="dashboard-page">
      <div className="dashboard-page__header">
        <h1>Панель управления</h1>
        <p>Обзор системы регистрации мероприятий</p>
      </div>

      {isLoading && (
        <p className="dashboard-page__state">Загрузка статистики...</p>
      )}

      {error && (
        <p className="dashboard-page__state dashboard-page__state--error">{error}</p>
      )}

      {!isLoading && !error && data && (
        <div className="dashboard-page__stats">
          <StatsCard
            title="Всего мероприятий"
            value={String(data.total_events)}
            accent={data.events_this_month > 0 ? `+${data.events_this_month} в этом месяце` : ''}
            icon="▣"
          />
          <StatsCard
            title="Всего участников"
            value={String(data.total_participants)}
            accent={data.participants_this_week > 0 ? `+${data.participants_this_week} за неделю` : ''}
            icon="♙"
          />
          <StatsCard
            title="Посетили мероприятия"
            value={String(data.total_visited)}
            accent={`${data.attendance_rate.toFixed(1)}% явка`}
            icon="✓"
          />
        </div>
      )}

      {events.length > 0 && selectedEventId !== null && (
        <div className="dashboard-page__analytics">
          <article className="dashboard-card dashboard-card--wide">
            <div className="dashboard-card__header">
              <h2>Посещаемость по часам</h2>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="dashboard-page__event-select"
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {isLoadingAnalytics ? (
              <p className="dashboard-page__state">Загрузка...</p>
            ) : hourlyStats.length === 0 ? (
              <p className="dashboard-page__state">Нет данных по часам</p>
            ) : (
              <div className="bar-chart">
                {hourlyStats.map((item) => {
                  const maxCount = Math.max(...hourlyStats.map((s) => s.count), 1);
                  const heightPx = (item.count / maxCount) * 140;
                  return (
                    <div className="bar-chart__item" key={item.hour}>
                      <div
                        className="bar-chart__bar"
                        style={{ height: `${heightPx}px` }}
                        title={`${item.count} ${item.count === 1 ? 'участник' : 'участников'}`}
                      />
                      <span>{item.hour}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="dashboard-card">
            <h2>Явка участников</h2>

            {isLoadingAnalytics ? (
              <p className="dashboard-page__state">Загрузка...</p>
            ) : !eventStats || eventStats.total === 0 ? (
              <p className="dashboard-page__state">Пока нет участников</p>
            ) : (
              <>
                <div className="donut">
                  <div
                    className="donut__circle"
                    style={{
                      background: `radial-gradient(circle, #ffffff 0 48%, transparent 49%),
                                   conic-gradient(#10b981 0 ${(eventStats.visited / eventStats.total) * 100}%,
                                                  #dfe7ef ${(eventStats.visited / eventStats.total) * 100}% 100%)`,
                    }}
                  />
                </div>
                <div className="attendance">
                  <div>
                    <span className="attendance__dot attendance__dot--green" />
                    Посетили
                    <strong>
                      {eventStats.visited} ({Math.round((eventStats.visited / eventStats.total) * 100)}%)
                    </strong>
                  </div>
                  <div>
                    <span className="attendance__dot attendance__dot--gray" />
                    Не посетили
                    <strong>
                      {eventStats.absent} ({Math.round((eventStats.absent / eventStats.total) * 100)}%)
                    </strong>
                  </div>
                </div>
              </>
            )}
          </article>
        </div>
      )}

      {events.length > 0 && (
        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h2>Ближайшие мероприятия</h2>
            <Link to={ROUTES.events}>Все мероприятия ↗</Link>
          </div>

          <div className="dashboard-events">
            {[...events]
              .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
              .slice(0, 5)
              .map((event) => (
                <div className="dashboard-event" key={event.id}>
                  <div className="dashboard-event__icon">▣</div>
                  <div>
                    <strong>{event.title}</strong>
                    <p>
                      {new Date(event.start_at).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {event.location}
                    </p>
                  </div>
                  <span>
                    {event.registration_status === 'open'
                      ? 'Открыта'
                      : event.registration_status === 'closed'
                        ? 'Закрыта'
                        : 'Завершена'}
                  </span>
                </div>
              ))}
          </div>
        </article>
      )}
    </section>
  );
}
