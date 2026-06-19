import { StatsCard } from '../../components/StatsCard/StatsCard';

import './DashboardPage.css';

const dashboardStats = [
  {
    title: 'Количество мероприятий',
    value: 0,
    description: 'Всего создано мероприятий',
  },
  {
    title: 'Количество участников',
    value: 0,
    description: 'Всего зарегистрировано участников',
  },
  {
    title: 'Количество посетителей',
    value: 0,
    description: 'Участники, отметившиеся на входе',
  },
];

export function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page__header">
        <h2 className="dashboard-page__title">Dashboard</h2>
        <p className="dashboard-page__description">
          Общая статистика системы регистрации мероприятий.
        </p>
      </div>

      <div className="dashboard-page__grid">
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>
    </section>
  );
}