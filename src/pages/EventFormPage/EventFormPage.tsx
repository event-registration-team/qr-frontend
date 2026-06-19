import './EventFormPage.css';

interface EventFormPageProps {
  mode: 'create' | 'edit';
}

export function EventFormPage({ mode }: EventFormPageProps) {
  const isCreate = mode === 'create';

  return (
    <section className="event-form-page">
      <div className="event-form-page__header">
        <button
          type="button"
          className="event-form-page__back"
        >
          ←
        </button>

        <div>
          <h1>
            {isCreate
              ? 'Создание мероприятия'
              : 'Редактирование мероприятия'}
          </h1>

          <p>
            {isCreate
              ? 'Заполните информацию о новом мероприятии'
              : 'Измените информацию о мероприятии'}
          </p>
        </div>
      </div>

      <div className="event-form-card">
        <h2>Основная информация</h2>

        <label>
          Название мероприятия *

          <input
            type="text"
            placeholder="Введите название мероприятия"
          />
        </label>

        <label>
          Описание

          <textarea
            placeholder="Опишите мероприятие..."
          />
        </label>

        <label>
          Место проведения *

          <input
            type="text"
            placeholder="Адрес или название площадки"
          />
        </label>

        <div className="event-form-card__grid">
          <label>
            Дата и время начала *

            <input
              type="text"
              placeholder="15.12.2024 10:00"
            />
          </label>

          <label>
            Дата и время окончания

            <input
              type="text"
              placeholder="15.12.2024 18:00"
            />
          </label>
        </div>

        <div className="event-form-card__grid">
          <label>
            Максимум участников

            <input
              type="number"
              placeholder="500"
            />
          </label>

          <label>
            Статус регистрации

            <select defaultValue="open">
              <option value="open">Открыта</option>
              <option value="closed">Закрыта</option>
              <option value="completed">Завершена</option>
            </select>
          </label>
        </div>

        <label>
          Ссылка на материалы

          <input
            type="url"
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="event-form-card">
        <h2>Настройки регистрационной формы</h2>

        <p>
          Выберите дополнительные поля, которые будут отображаться участникам при
          регистрации.
        </p>

        <label className="event-form-card__checkbox">
          <input type="checkbox" />
          Запрашивать телефон
        </label>

        <label className="event-form-card__checkbox">
          <input type="checkbox" />
          Запрашивать номер автомобиля
        </label>
      </div>

      <div className="event-form-actions">
        <button
          type="button"
          className="event-form-actions__cancel"
        >
          Отмена
        </button>

        <button
          type="submit"
          className="event-form-actions__submit"
        >
          {isCreate
            ? 'Создать мероприятие'
            : 'Сохранить изменения'}
        </button>
      </div>
    </section>
  );
}