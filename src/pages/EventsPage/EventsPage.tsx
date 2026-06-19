import { Link } from 'react-router-dom';

import { ROUTES } from '../../router/routes';

import './EventsPage.css';

const events = [
  {
    id: 1,
    title: 'TechConf 2024',
    date: '15.12.2024, 10:00',
    location: 'Москва, Центр «Экспо»',
    status: 'Открыта',
  },
  {
    id: 2,
    title: 'Design Summit',
    date: '20.12.2024, 09:00',
    location: 'Санкт-Петербург, Лофт Проект',
    status: 'Закрыта',
  },
  {
    id: 3,
    title: 'AI Forum 2024',
    date: '25.12.2024, 11:00',
    location: 'Казань, IT-парк',
    status: 'Открыта',
  },
  {
    id: 4,
    title: 'DevOps Day',
    date: '10.01.2025, 09:30',
    location: 'Москва, Технополис',
    status: 'Открыта',
  },
];

export function EventsPage() {
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

                <td>{event.date}</td>
                <td>{event.location}</td>

                <td>
                  <span
                    className={
                      event.status === 'Открыта'
                        ? 'events-table__status events-table__status--open'
                        : 'events-table__status events-table__status--closed'
                    }
                  >
                    • {event.status}
                  </span>
                </td>

                <td>
                  <div className="events-table__actions">
                    <Link to={`/events/${event.id}/edit`}>✎ Редактировать</Link>
                    <button type="button">🗑 Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="events-page__footer">
          <span>Показано 4 из 4 мероприятий</span>

          <div className="events-page__pagination">
            <button className="events-page__pagination-active">1</button>
            <button>2</button>
            <button>3</button>
          </div>
        </div>
      </div>
    </section>
  );
}