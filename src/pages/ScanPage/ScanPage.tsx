import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../../services/api';

export function ScanPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const res = await api.get(
            `/participants/scan?token=${encodeURIComponent(decodedText)}`
          );

          setResult(res.data);
          setError('');
        } catch {
          setError('Участник не найден');
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  async function handleCheckIn() {
    try {
      await api.post(`/participants/${result.id}/check-in`);

      alert('Успешный вход!');
      setResult(null);
    } catch {
      alert('Ошибка check-in');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Сканер QR</h2>

      <div id="qr-reader" style={{ width: 300 }} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>
            {result.last_name} {result.first_name}
          </h3>

          <p>{result.email}</p>

          <button onClick={handleCheckIn}>
            Подтвердить вход
          </button>
        </div>
      )}
    </div>
  );
}
