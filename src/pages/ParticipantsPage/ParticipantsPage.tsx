import './ParticipantsPage.css';

const participants = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan.petrov@email.ru',
    phone: '+7 999 123-45-67',
    car: 'А123ВС777',
    registeredAt: '01.12.2024 14:23',
    status: 'Посетил',
    checkedInAt: '15.12.2024 10:15',
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    email: 'maria.sidorova@email.ru',
    phone: '+7 999 234-56-78',
    car: 'Не указан',
    registeredAt: '02.12.2024 09:12',
    status: 'Зарегистрирован',
    checkedInAt: '—',
  },
  {
    id: 3,
    name: 'Алексей Иванов',
    email: 'alexey.ivanov@email.ru',
    phone: 'Не указан',
    car: 'М456КТ777',
    registeredAt: '03.12.2024 18:40',
    status: 'Посетил',
    checkedInAt: '15.12.2024 10:32',
  },
];

export function ParticipantsPage() {
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
        </div>
      </div>

      <div className="participants-page__card">
        <div className="participants-page__filters">
          <input type="text" placeholder="Поиск по ФИО или Email..." />

          <select defaultValue="techconf">
            <option value="techconf">TechConf 2024</option>
          </select>

          <select defaultValue="all">
            <option value="all">Все участники</option>
            <option value="visited">Посетившие</option>
            <option value="notVisited">Не посетившие</option>
          </select>
        </div>

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
            {participants.map((participant) => (
              <tr key={participant.id}>
                <td>
                  <strong>{participant.name}</strong>
                </td>
                <td>{participant.email}</td>
                <td>{participant.phone}</td>
                <td>{participant.car}</td>
                <td>{participant.registeredAt}</td>
                <td>
                  <span
                    className={
                      participant.status === 'Посетил'
                        ? 'participants-status participants-status--visited'
                        : 'participants-status'
                    }
                  >
                    {participant.status}
                  </span>
                </td>
                <td>{participant.checkedInAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="participants-page__footer">
          <span>Показано 3 из 468 участников</span>

          <div className="participants-page__pagination">
            <button type="button" className="participants-page__pagination-active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
          </div>
        </div>
      </div>
    </section>
  );
}