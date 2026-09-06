import { useEffect, useState } from 'react';

import { eventService, type ApiEvent } from '../../services/eventService';
import {
  eventStatsService,
  type EventStats,
  type HourlyStat,
} from '../../services/eventStatsService';

import './StatisticsPage.css';

function percent(part: number, whole: number) {
  return whole > 0 ? (part / whole) * 100 : 0;
}

export function StatisticsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [stats, setStats] = useState<EventStats | null>(null);
  const [hourly, setHourly] = useState<HourlyStat[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    eventService
      .getEvents()
      .then((list) => {
        setEvents(list);
        if (list.length > 0) {
          setSelectedEventId(list[0].id);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setError('Не удалось загрузить мероприятия');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedEventId === null) return;

    setIsLoading(true);
    setError('');

    Promise.all([
      eventStatsService.getEventStats(selectedEventId),
      eventStatsService.getHourlyStats(selectedEventId),
    ])
      .then(([eventStats, hourlyStats]) => {
        setStats(eventStats);
        setHourly(hourlyStats);
      })
      .catch(() => {
        setError('Не удалось загрузить статистику');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedEventId]);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
  const maxParticipants = selectedEvent?.max_participants ?? null;

  // API отдаёт { hour, count } — приводим к форме { time, value }, которую ждёт разметка
  const hourlyStats = hourly.map((item) => ({ time: item.hour, value: item.count }));
  const maxHourly = Math.max(...hourlyStats.map((item) => item.value), 1);

  return (
    <section className="statistics-page">
      <div className="statistics-page__header">
        <div>
          <h1>Статистика мероприятия</h1>
          <p>Детальная аналитика посещаемости</p>
        </div>

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
      </div>

      {isLoading && <p className="statistics-page__state">Загрузка статистики...</p>}

      {!isLoading && error && (
        <p className="statistics-page__state statistics-page__state--error">{error}</p>
      )}

      {!isLoading && !error && events.length === 0 && (
        <p className="statistics-page__state">Мероприятия не найдены</p>
      )}

      {!isLoading && !error && stats && (
        <>
          <div className="statistics-page__cards">
            <article className="statistics-card">
              <p>Всего зарегистрировано</p>
              <strong>{stats.total}</strong>
              {maxParticipants != null && (
                <>
                  <span>из {maxParticipants} максимум</span>
                  <div className="statistics-card__progress">
                    <div
                      style={{
                        width: `${Math.min(percent(stats.total, maxParticipants), 100)}%`,
                      }}
                    />
                  </div>
                </>
              )}
            </article>

            <article className="statistics-card">
              <p>Пришло на мероприятие</p>
              <strong className="statistics-card__success">{stats.visited}</strong>
              <span>{percent(stats.visited, stats.total).toFixed(1)}% явка</span>
              <div className="statistics-card__progress statistics-card__progress--green">
                <div style={{ width: `${percent(stats.visited, stats.total)}%` }} />
              </div>
            </article>

            <article className="statistics-card">
              <p>Не пришло</p>
              <strong>{stats.absent}</strong>
              <span>{percent(stats.absent, stats.total).toFixed(1)}% не явились</span>
              <div className="statistics-card__progress statistics-card__progress--gray">
                <div style={{ width: `${percent(stats.absent, stats.total)}%` }} />
              </div>
            </article>
          </div>

          <div className="statistics-page__charts">
            <article className="statistics-chart">
              <h2>Посещаемость по часам</h2>

              {hourlyStats.length === 0 ? (
                <p className="statistics-page__state">Нет данных о посещениях</p>
              ) : (
                <div className="statistics-bars">
                  {hourlyStats.map((item) => (
                    <div className="statistics-bars__item" key={item.time}>
                      <div
                        className="statistics-bars__bar statistics-bars__bar--blue"
                        style={{ height: `${(item.value / maxHourly) * 140}px` }}
                      />
                      <span>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </>
      )}
    </section>
  );
}
