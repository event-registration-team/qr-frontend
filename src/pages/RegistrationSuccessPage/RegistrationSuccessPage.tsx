import { useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import type { RegisterResponse } from '../../types/api';
import { ROUTES } from '../../router/routes';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import './RegistrationSuccessPage.css';

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date(dateString))
    .replace(' г.', '');
}

export function RegistrationSuccessPage() {
  const { eventToken } = useParams<{ eventToken: string }>();
  const location = useLocation();
  const state = location.state as RegisterResponse | null;
  const [downloading, setDownloading] = useState(false);

  if (!state) {
    return <Navigate to={ROUTES.register.replace(':eventToken', eventToken!)} replace />;
  }

  const fullName = [state.participant.lastName, state.participant.firstName, state.participant.middleName]
    .filter(Boolean)
    .join(' ');

  const handleDownload = async () => {
    if (!state.qrImageDataUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(state.qrImageDataUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-pass-${state.participantId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent — QR is still visible on screen
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="success-page">
      <div className="success-page__badge" role="status">
        ✓ Регистрация успешна!
      </div>

      <Card className="success-page__qr-card">
        <h2 className="success-page__section-title">Ваш QR-пропуск</h2>
        <p className="success-page__section-sub">Предъявите на входе при регистрации</p>
        {state.qrImageDataUrl && (
          <img
            className="success-page__qr-image"
            src={state.qrImageDataUrl}
            alt="QR-код для входа"
            width={240}
            height={240}
          />
        )}
      </Card>

      <Card className="success-page__info-card">
        <h3 className="success-page__info-heading">Участник</h3>
        <p className="success-page__info-value">{fullName}</p>
        <p className="success-page__info-value success-page__info-value--muted">
          {state.participant.email}
        </p>
      </Card>

      <Card className="success-page__info-card">
        <h3 className="success-page__info-heading">Мероприятие</h3>
        <p className="success-page__info-value">{state.event.title}</p>
        <p className="success-page__info-value success-page__info-value--muted">
          {formatDate(state.event.startAt)}
        </p>
        <p className="success-page__info-value success-page__info-value--muted">
          {state.event.location}
        </p>
      </Card>

      {state.qrImageDataUrl && (
        <Button
          variant="accent"
          size="lg"
          loading={downloading}
          onClick={handleDownload}
          type="button"
        >
          Скачать QR-код
        </Button>
      )}
    </div>
  );
}
