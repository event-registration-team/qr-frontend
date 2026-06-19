import './ImportExportPage.css';

export function ImportExportPage() {
  return (
    <section className="import-export-page">
      <div className="import-export-page__header">
        <h1>Импорт и экспорт участников</h1>
        <p>Управление списками участников через Excel-файлы</p>
      </div>

      <div className="import-export-page__grid">
        <article className="import-export-card">
          <div className="import-export-card__title">
            <span>⇧</span>
            <div>
              <h2>Импорт из Excel</h2>
              <p>Загрузите список участников</p>
            </div>
          </div>

          <label>
            Мероприятие
            <select defaultValue="techconf">
              <option value="techconf">TechConf 2024</option>
            </select>
          </label>

          <div className="upload-zone">
            <div className="upload-zone__icon">⇧</div>
            <strong>Перетащите файл сюда</strong>
            <p>или нажмите для выбора</p>
            <span>Поддерживаемые форматы: .xlsx, .xls</span>
          </div>

          <button type="button" className="import-export-card__button import-export-card__button--disabled">
            Загрузить участников
          </button>
        </article>

        <article className="import-export-card">
          <div className="import-export-card__title">
            <span>⇩</span>
            <div>
              <h2>Экспорт в Excel</h2>
              <p>Скачайте данные участников</p>
            </div>
          </div>

          <label>
            Мероприятие
            <select defaultValue="techconf">
              <option value="techconf">TechConf 2024</option>
            </select>
          </label>

          <div className="export-options">
            <p>Тип экспорта</p>

            <label>
              <input type="radio" name="exportType" defaultChecked />
              Все участники
            </label>

            <label>
              <input type="radio" name="exportType" />
              Только посетившие
            </label>

            <label>
              <input type="radio" name="exportType" />
              Не посетившие
            </label>
          </div>

          <div className="export-fields">
            <p>Поля в выгрузке:</p>

            <div>
              <span>ФИО</span>
              <span>Email</span>
              <span>Телефон</span>
              <span>Номер авто</span>
              <span>Дата регистрации</span>
              <span>Статус</span>
              <span>Время прохода</span>
            </div>
          </div>

          <button type="button" className="import-export-card__button">
            Скачать Excel
          </button>
        </article>
      </div>

      <div className="import-export-page__note">
        ⚠ Формат файла импорта: файл должен содержать колонки Фамилия, Имя, Email. Первая строка — заголовки.
      </div>
    </section>
  );
}