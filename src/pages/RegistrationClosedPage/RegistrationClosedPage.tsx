import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { getEvent } from '../../api/publicApi';
import type { PublicEvent } from '../../types/api';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import './RegistrationClosedPage.css';

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date(dateString))
    .replace(' г.', '');
}

export function RegistrationClosedPage() {
  const { eventToken } = useParams<{ eventToken: string }>();
  const location = useLocation();
  const reason = (location.state as { reason?: 'closed' | 'full' } | null)?.reason;

  const isFull = reason === 'full';
  const title = isFull ? 'Все места заняты' : 'Регистрация закрыта';
  const text = isFull
    ? 'К сожалению, лимит участников этого мероприятия уже достигнут. Следите за новостями в наших каналах — возможно, появятся свободные места.'
    : 'Регистрация на это мероприятие закрыта организатором. Следите за новостями в наших каналах.';
  const icon = isFull ? '👥' : '🔒';
  const iconClass = isFull ? 'closed-page__icon closed-page__icon--full' : 'closed-page__icon';

  const [event, setEvent] = useState<PublicEvent | null>(null);

  useEffect(() => {
    if (!eventToken) return;
    getEvent(Number(eventToken))
      .then(setEvent)
      .catch(() => {});
  }, [eventToken]);

  return (
    <div className="closed-page">
      <Card className="closed-page__card">
        <div className={iconClass} aria-hidden="true">
          {icon}
        </div>
        <h1 className="closed-page__title">{title}</h1>
        <p className="closed-page__text">{text}</p>

        {event && (
          <div className="closed-page__event-info">
            <p className="closed-page__event-title">{event.title}</p>
            <p className="closed-page__event-detail">{formatDate(event.start_at)}</p>
            <p className="closed-page__event-detail">{event.location}</p>
          </div>
        )}

        <Button
          variant="ghost"
          size="lg"
          onClick={() => window.history.back()}
          type="button"
        >
          ← Вернуться назад
        </Button>
      </Card>
    </div>
  );
}
