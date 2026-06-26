import { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import type { RegisterResponse } from '../../types/api';
import { getQrcodeUrl } from '../../api/publicApi';
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
  const [downloading, setDownloading] = useState(false);

  const stateData = location.state as RegisterResponse | null;
  const storageKey = `registrationSuccess:${eventToken}`;
  const storedJson = sessionStorage.getItem(storageKey);
  const storedData = storedJson ? (JSON.parse(storedJson) as RegisterResponse) : null;
  const data = stateData ?? storedData;

  useEffect(() => {
    if (stateData) {
      sessionStorage.setItem(storageKey, JSON.stringify(stateData));
    }
  }, [stateData, storageKey]);

  if (!data) {
    return <Navigate to={ROUTES.register.replace(':eventToken', eventToken!)} replace />;
  }

  const qrUrl = getQrcodeUrl(data.participant.id);
  const fullName = [
    data.participant.last_name,
    data.participant.first_name,
    data.participant.middle_name,
  ]
    .filter(Boolean)
    .join(' ');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-pass-${data.participant.id}.png`;
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
        <img
          className="success-page__qr-image"
          src={qrUrl}
          alt="QR-код для входа"
          width={240}
          height={240}
        />
      </Card>

      <Card className="success-page__info-card">
        <h3 className="success-page__info-heading">Участник</h3>
        <p className="success-page__info-value">{fullName}</p>
        <p className="success-page__info-value success-page__info-value--muted">
          {data.participant.email}
        </p>
      </Card>

      <Card className="success-page__info-card">
        <h3 className="success-page__info-heading">Мероприятие</h3>
        <p className="success-page__info-value">{data.event.title}</p>
        <p className="success-page__info-value success-page__info-value--muted">
          {formatDate(data.event.start_at)}
        </p>
        <p className="success-page__info-value success-page__info-value--muted">
          {data.event.location}
        </p>
      </Card>

      <Button
        variant="accent"
        size="lg"
        loading={downloading}
        onClick={handleDownload}
        type="button"
      >
        Скачать QR-код
      </Button>
    </div>
  );
}
