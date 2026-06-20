import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getPublicEvent, registerParticipant } from '../../api/publicApi';
import { makeRegistrationSchema, type RegistrationFormValues } from '../../lib/validation';
import type { ApiError, PublicEvent } from '../../types/api';
import { ROUTES } from '../../router/routes';
import { Button } from '../../components/ui/Button/Button';
import { TextField } from '../../components/ui/TextField/TextField';
import { Card } from '../../components/ui/Card/Card';
import './RegisterPage.css';

function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'code' in err;
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

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [emailTakenError, setEmailTakenError] = useState(false);
  const [generalError, setGeneralError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventToken) return;
    setLoading(true);
    getPublicEvent(eventToken)
      .then(setEvent)
      .catch((err) => {
        if (isApiError(err) && err.code === 'EVENT_NOT_FOUND') {
          setNotFound(true);
        } else {
          setGeneralError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [eventToken]);

  const schema = event
    ? makeRegistrationSchema({
        requirePhone: event.requirePhone,
        requireCarNumber: event.requireCarNumber,
      })
    : makeRegistrationSchema({ requirePhone: false, requireCarNumber: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastName: '',
      firstName: '',
      middleName: '',
      email: '',
      phone: '',
      carNumber: '',
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!eventToken || !event) return;
    setEmailTakenError(false);
    setGeneralError(false);
    setSubmitting(true);
    try {
      const response = await registerParticipant(eventToken, {
        lastName: values.lastName,
        firstName: values.firstName,
        middleName: values.middleName || undefined,
        email: values.email,
        phone: values.phone || undefined,
        carNumber: values.carNumber || undefined,
      });
      navigate(ROUTES.registerSuccess.replace(':eventToken', eventToken), {
        state: response,
        replace: true,
      });
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === 'EMAIL_ALREADY_REGISTERED') {
          setEmailTakenError(true);
        } else if (err.code === 'EVENT_FULL' || err.code === 'REGISTRATION_CLOSED') {
          navigate(ROUTES.registerClosed.replace(':eventToken', eventToken), {
            state: { reason: err.code === 'EVENT_FULL' ? 'full' : 'closed' },
            replace: true,
          });
        } else {
          setGeneralError(true);
        }
      } else {
        setGeneralError(true);
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

  if (generalError && !event) {
    return (
      <Card>
        <p className="register-page__status">Что-то пошло не так, попробуйте позже</p>
      </Card>
    );
  }

  if (
    event &&
    (event.registrationStatus === 'closed' || event.isFull)
  ) {
    return (
      <Navigate
        to={ROUTES.registerClosed.replace(':eventToken', eventToken!)}
        state={{ reason: event.isFull ? 'full' : 'closed' }}
        replace
      />
    );
  }

  return (
    <Card>
      <h1 className="register-page__title">Регистрация на мероприятие</h1>
      {event && (
        <p className="register-page__subtitle">
          {formatDate(event.startAt)} · {event.location}
        </p>
      )}

      {emailTakenError && (
        <div className="register-page__alert" role="alert">
          На данный адрес электронной почты уже оформлена регистрация на данное мероприятие
        </div>
      )}
      {generalError && (
        <div className="register-page__alert" role="alert">
          Что-то пошло не так, попробуйте позже
        </div>
      )}

      <form className="register-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Фамилия"
          required
          placeholder="Иванов"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <TextField
          label="Имя"
          required
          placeholder="Иван"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <TextField
          label="Отчество"
          placeholder="Иванович"
          error={errors.middleName?.message}
          {...register('middleName')}
        />
        <TextField
          label="Email"
          required
          type="email"
          placeholder="ivan@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        {event?.requirePhone && (
          <TextField
            label="Телефон"
            required
            type="tel"
            placeholder="+7 (900) 000-00-00"
            error={errors.phone?.message}
            {...register('phone')}
          />
        )}
        {event?.requireCarNumber && (
          <TextField
            label="Номер автомобиля"
            required
            placeholder="А000АА77"
            error={errors.carNumber?.message}
            {...register('carNumber')}
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
