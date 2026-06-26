import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '../../router/routes';
import { eventService, type ApiEvent } from '../../services/eventService';

import './EventFormPage.css';

interface EventFormPageProps {
  mode: 'create' | 'edit';
}

function toApiDate(value: string) {
  return value.length === 16 ? `${value}:00` : value;
}

function toInputDate(value?: string) {
  if (!value) return '';

  return value.slice(0, 16);
}

export function EventFormPage({ mode }: EventFormPageProps) {
  const isCreate = mode === 'create';
  const navigate = useNavigate();
  const params = useParams();

  const eventId = params.id ? Number(params.id) : null;

  const [eventData, setEventData] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(!isCreate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCreate || !eventId) {
      return;
    }

    eventService
      .getEventById(eventId)
      .then(setEventData)
      .catch(() => {
        setError('Не удалось загрузить мероприятие');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [eventId, isCreate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get('title') || '').trim();
    const location = String(formData.get('location') || '').trim();
    const startAt = String(formData.get('start_at') || '');
    const endAt = String(formData.get('end_at') || '');

    if (!title || !location || !startAt || !endAt) {
      setError('Заполните обязательные поля');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title,
      description: String(formData.get('description') || '').trim() || null,
      location,
      start_at: toApiDate(startAt),
      end_at: toApiDate(endAt),
      registration_status: String(formData.get('registration_status') || 'open') as
        | 'open'
        | 'closed'
        | 'completed',
      max_participants: formData.get('max_participants')
        ? Number(formData.get('max_participants'))
        : null,
      materials_link: String(formData.get('materials_link') || '').trim() || null,
      require_phone: formData.get('require_phone') === 'on',
      require_car_number: formData.get('require_car_number') === 'on',
      registration_link: eventData?.registration_link || '',
    };

    try {
      if (isCreate) {
        await eventService.createEvent(payload);
      } else if (eventId) {
        await eventService.updateEvent(eventId, payload);
      }

      navigate(ROUTES.events);
    } catch {
      setError(
        isCreate
          ? 'Не удалось создать мероприятие'
          : 'Не удалось сохранить изменения',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="event-form-page">
        <p>Загрузка мероприятия...</p>
      </section>
    );
  }

  return (
    <section className="event-form-page">
      <div className="event-form-page__header">
        <button
          type="button"
          className="event-form-page__back"
          onClick={() => navigate(ROUTES.events)}
        >
          ←
        </button>

        <div>
          <h1>{isCreate ? 'Создание мероприятия' : 'Редактирование мероприятия'}</h1>

          <p>
            {isCreate
              ? 'Заполните информацию о новом мероприятии'
              : 'Измените информацию о мероприятии'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="event-form-card">
          <h2>Основная информация</h2>

          <label>
            Название мероприятия *
            <input
              name="title"
              type="text"
              placeholder="Введите название мероприятия"
              defaultValue={eventData?.title || ''}
            />
          </label>

          <label>
            Описание
            <textarea
              name="description"
              placeholder="Опишите мероприятие..."
              defaultValue={eventData?.description || ''}
            />
          </label>

          <label>
            Место проведения *
            <input
              name="location"
              type="text"
              placeholder="Адрес или название площадки"
              defaultValue={eventData?.location || ''}
            />
          </label>

          <div className="event-form-card__grid">
            <label>
              Дата и время начала *
              <input
                name="start_at"
                type="datetime-local"
                defaultValue={toInputDate(eventData?.start_at)}
              />
            </label>

            <label>
              Дата и время окончания
              <input
                name="end_at"
                type="datetime-local"
                defaultValue={toInputDate(eventData?.end_at)}
              />
            </label>
          </div>

          <div className="event-form-card__grid">
            <label>
              Максимум участников
              <input
                name="max_participants"
                type="number"
                placeholder="500"
                defaultValue={eventData?.max_participants ?? ''}
              />
            </label>

            <label>
              Статус регистрации
              <select
                name="registration_status"
                defaultValue={eventData?.registration_status || 'open'}
              >
                <option value="open">Открыта</option>
                <option value="closed">Закрыта</option>
                <option value="completed">Завершена</option>
              </select>
            </label>
          </div>

          <label>
            Ссылка на материалы
            <input
              name="materials_link"
              type="url"
              placeholder="https://..."
              defaultValue={eventData?.materials_link || ''}
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
            <input
              name="require_phone"
              type="checkbox"
              defaultChecked={eventData?.require_phone || false}
            />
            Запрашивать телефон
          </label>

          <label className="event-form-card__checkbox">
            <input
              name="require_car_number"
              type="checkbox"
              defaultChecked={eventData?.require_car_number || false}
            />
            Запрашивать номер автомобиля
          </label>
        </div>

        {error && <p className="event-form-error">{error}</p>}

        <div className="event-form-actions">
          <button
            type="button"
            className="event-form-actions__cancel"
            onClick={() => navigate(ROUTES.events)}
          >
            Отмена
          </button>

          <button
            type="submit"
            className="event-form-actions__submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Сохранение...'
              : isCreate
                ? 'Создать мероприятие'
                : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </section>
  );
}