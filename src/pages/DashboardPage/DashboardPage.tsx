import { StatsCard } from '../../components/StatsCard/StatsCard';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

import './DashboardPage.css';

const stats = [
  {
    title: 'Всего мероприятий',
    value: '12',
    accent: '+2 в этом месяце',
    icon: '▣',
  },
  {
    title: 'Всего участников',
    value: '1 248',
    accent: '+87 за неделю',
    icon: '♙',
  },
  {
    title: 'Посетили мероприятия',
    value: '934',
    accent: '74.8% явка',
    icon: '✓',
  },
];

const events = [
  {
    title: 'TechConf 2024',
    date: '15.12.2024, 10:00',
    place: 'Москва, Центр «Экспо»',
    status: 'Открыта',
  },
];

export function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page__header">
        <h1>Панель управления</h1>
        <p>Обзор системы регистрации мероприятий</p>
      </div>

      <div className="dashboard-page__stats">
        {stats.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            accent={item.accent}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="dashboard-page__analytics">
        <article className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__header">
            <h2>Посещаемость по часам — TechConf 2024</h2>
            <span>15 декабря 2024</span>
          </div>

          <div className="bar-chart">
            {[12, 45, 38, 22, 8, 15, 6].map((height, index) => (
              <div className="bar-chart__item" key={index}>
                <div className="bar-chart__bar" style={{ height: `${height * 2}px` }} />
                <span>{`${9 + index}:00`}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <h2>Явка участников</h2>

          <div className="donut">
            <div className="donut__circle" />
          </div>

          <div className="attendance">
            <div>
              <span className="attendance__dot attendance__dot--green" />
              Посетили
              <strong>342 (73%)</strong>
            </div>

            <div>
              <span className="attendance__dot attendance__dot--gray" />
              Не посетили
              <strong>126 (27%)</strong>
            </div>
          </div>
        </article>
      </div>

      <article className="dashboard-card">
        <div className="dashboard-card__header">
          <h2>Ближайшие мероприятия</h2>
          <Link to={ROUTES.events}>Все мероприятия ↗</Link>
        </div>

        <div className="dashboard-events">
          {events.map((event) => (
            <div className="dashboard-event" key={event.title}>
              <div className="dashboard-event__icon">▣</div>

              <div>
                <strong>{event.title}</strong>
                <p>
                  {event.date} · {event.place}
                </p>
              </div>

              <span>{event.status}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
