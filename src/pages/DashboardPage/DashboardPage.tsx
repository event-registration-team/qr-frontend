import { useEffect, useState } from 'react';

import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { StatsCard } from '../../components/StatsCard/StatsCard';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

import './DashboardPage.css';

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    </section>
  );
}
