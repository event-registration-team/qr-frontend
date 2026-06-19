import './StatisticsPage.css';

const hourlyStats = [
  { time: '09:00', value: 12 },
  { time: '10:00', value: 45 },
  { time: '11:00', value: 38 },
  { time: '12:00', value: 22 },
  { time: '13:00', value: 8 },
  { time: '14:00', value: 15 },
  { time: '15:00', value: 6 },
];

const dailyStats = [
  { day: '09.12', value: 24 },
  { day: '10.12', value: 42 },
  { day: '11.12', value: 65 },
  { day: '12.12', value: 88 },
  { day: '13.12', value: 112 },
  { day: '14.12', value: 74 },
  { day: '15.12', value: 52 },
];

export function StatisticsPage() {
  return (
    <section className="statistics-page">
      <div className="statistics-page__header">
        <div>
          <h1>Статистика мероприятия</h1>
          <p>Детальная аналитика посещаемости</p>
        </div>

        <select defaultValue="techconf">
          <option value="techconf">TechConf 2024</option>
        </select>
      </div>

      <div className="statistics-page__cards">
        <article className="statistics-card">
          <p>Всего зарегистрировано</p>
          <strong>468</strong>
          <span>из 500 максимум</span>
          <div className="statistics-card__progress">
            <div style={{ width: '94%' }} />
          </div>
        </article>

        <article className="statistics-card">
          <p>Пришло на мероприятие</p>
          <strong className="statistics-card__success">342</strong>
          <span>73.1% явка</span>
          <div className="statistics-card__progress statistics-card__progress--green">
            <div style={{ width: '73%' }} />
          </div>
        </article>

        <article className="statistics-card">
          <p>Не пришло</p>
          <strong>126</strong>
          <span>26.9% не явились</span>
          <div className="statistics-card__progress statistics-card__progress--gray">
            <div style={{ width: '27%' }} />
          </div>
        </article>
      </div>

      <div className="statistics-page__charts">
        <article className="statistics-chart">
          <h2>Посещаемость по часам</h2>

          <div className="statistics-bars">
            {hourlyStats.map((item) => (
              <div className="statistics-bars__item" key={item.time}>
                <div
                  className="statistics-bars__bar statistics-bars__bar--blue"
                  style={{ height: `${item.value * 3}px` }}
                />
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="statistics-chart">
          <h2>Регистрации по дням</h2>

          <div className="statistics-bars">
            {dailyStats.map((item) => (
              <div className="statistics-bars__item" key={item.day}>
                <div
                  className="statistics-bars__bar statistics-bars__bar--green"
                  style={{ height: `${item.value * 1.4}px` }}
                />
                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}