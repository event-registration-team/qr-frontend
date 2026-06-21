import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getEvent, registerParticipant } from '../../api/publicApi';
import { makeRegistrationSchema, type RegistrationFormValues } from '../../lib/validation';
import type { NormalizedApiError, PublicEvent } from '../../types/api';
import { ROUTES } from '../../router/routes';
import { Button } from '../../components/ui/Button/Button';
import { TextField } from '../../components/ui/TextField/TextField';
import { Card } from '../../components/ui/Card/Card';
import './RegisterPage.css';

function isNormalizedError(err: unknown): err is NormalizedApiError {
  return typeof err === 'object' && err !== null && 'kind' in err;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date(dateString))
    .replace(' г.', '');
}

export function RegisterPage() {
  const { eventToken } = useParams<{ eventToken: string }>();
  const navigate = useNavigate();
  const eventId = Number(eventToken);

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [formAlert, setFormAlert] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventToken || isNaN(eventId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    getEvent(eventId)
      .then(setEvent)
      .catch((err) => {
        if (isNormalizedError(err) && err.kind === 'event_not_found') {
          setNotFound(true);
        } else {
          setLoadError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [eventToken, eventId]);

  const schema = event
    ? makeRegistrationSchema({
        require_phone: event.require_phone,
        require_car_number: event.require_car_number,
      })
    : makeRegistrationSchema({ require_phone: false, require_car_number: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      last_name: '',
      first_name: '',
      middle_name: '',
      email: '',
      phone: '',
      car_number: '',
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!event) return;
    setFormAlert(null);
    setSubmitting(true);
    try {
      const response = await registerParticipant({
        event_id: event.id,
        last_name: values.last_name,
        first_name: values.first_name,
        middle_name: values.middle_name || undefined,
        email: values.email,
        phone: values.phone || undefined,
        car_number: values.car_number || undefined,
      });
      navigate(ROUTES.registerSuccess.replace(':eventToken', eventToken!), {
        state: {
          message: response.message,
          qr_token: response.qr_token,
          participant: response.participant,
          event: {
            title: event.title,
            location: event.location,
            start_at: event.start_at,
          },
        },
        replace: true,
      });
    } catch (err) {
      if (isNormalizedError(err)) {
        switch (err.kind) {
          case 'email_already_registered':
            setFormAlert(
              'На данный адрес электронной почты уже оформлена регистрация на данное мероприятие',
            );
            break;
          case 'registration_closed_or_full':
            navigate(ROUTES.registerClosed.replace(':eventToken', eventToken!), {
              state: { reason: 'closed' },
              replace: true,
            });
            break;
          case 'validation_error':
            setFormAlert('Проверьте корректность введённых данных');
            break;
          case 'event_not_found':
            setNotFound(true);
            break;
          default:
            setFormAlert('Что-то пошло не так, попробуйте позже');
        }
      } else {
        setFormAlert('Что-то пошло не так, попробуйте позже');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="register-page__status">Загрузка...</div>;
  }

  if (notFound) {
    return (
      <Card className="register-page__not-found">
        <div className="register-page__not-found-icon" aria-hidden="true">❓</div>
        <h1 className="register-page__not-found-title">Мероприятие не найдено</h1>
        <p className="register-page__not-found-text">
          Проверьте, что вы перешли по правильной ссылке. Если проблема повторяется, свяжитесь с организатором.
        </p>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <p className="register-page__status">Что-то пошло не так, попробуйте позже</p>
      </Card>
    );
  }

  if (event && event.registration_status === 'closed') {
    return (
      <Navigate
        to={ROUTES.registerClosed.replace(':eventToken', eventToken!)}
        state={{ reason: 'closed' }}
        replace
      />
    );
  }

  if (event && event.current_participants_count >= event.max_participants) {
    return (
      <Navigate
        to={ROUTES.registerClosed.replace(':eventToken', eventToken!)}
        state={{ reason: 'full' }}
        replace
      />
    );
  }

  return (
    <Card>
      <h1 className="register-page__title">Регистрация на мероприятие</h1>
      {event && (
        <p className="register-page__subtitle">
          {formatDate(event.start_at)} · {event.location}
        </p>
      )}

      {formAlert && (
        <div className="register-page__alert" role="alert">
          {formAlert}
        </div>
      )}

      <form className="register-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Фамилия"
          required
          placeholder="Иванов"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
        <TextField
          label="Имя"
          required
          placeholder="Иван"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
        <TextField
          label="Отчество"
          placeholder="Иванович"
          error={errors.middle_name?.message}
          {...register('middle_name')}
        />
        <TextField
          label="Email"
          required
          type="email"
          placeholder="ivan@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        {event?.require_phone && (
          <TextField
            label="Телефон"
            required
            type="tel"
            placeholder="+7 (900) 000-00-00"
            error={errors.phone?.message}
            {...register('phone')}
          />
        )}
        {event?.require_car_number && (
          <TextField
            label="Номер автомобиля"
            required
            placeholder="А000АА77"
            error={errors.car_number?.message}
            {...register('car_number')}
          />
        )}

        <p className="register-page__hint">* Обязательные поля</p>

        <Button type="submit" variant="primary" size="lg" loading={submitting}>
          Зарегистрироваться
        </Button>
      </form>
    </Card>
  );
}
