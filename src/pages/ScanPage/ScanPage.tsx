import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../../services/api';

const QR_REGION_ID = 'qr-reader';

export function ScanPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  async function stopScanner() {
    const scanner = scannerRef.current;

    if (!scanner) return;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }

      scanner.clear();
    } catch {
      // камера уже остановлена — дополнительных действий не требуется
    }
  }

  useEffect(() => {
    return () => {
      stopScanner().finally(() => {
        scannerRef.current = null;
      });
    };
  }, []);

  async function handleScanSuccess(decodedText: string) {
    await stopScanner();
    setIsScanning(false);

    try {
      const res = await api.get(
        `/participants/scan?token=${encodeURIComponent(decodedText)}`
      );

      setResult(res.data);
      setError('');
    } catch {
      setResult(null);
      setError('Участник не найден');
    }
  }

  async function handleStart() {
    if (isStarting || isScanning) return;

    setError('');
    setResult(null);
    setIsStarting(true);
    setIsScanning(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(QR_REGION_ID);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          void handleScanSuccess(decodedText);
        },
        () => {}
      );
    } catch {
      setIsScanning(false);
      setError(
        'Не удалось запустить камеру. Проверьте разрешение на доступ к камере и попробуйте снова.'
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function handleStop() {
    await stopScanner();
    setIsScanning(false);
  }

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

      {!isScanning && (
        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          style={{ marginBottom: 12 }}
        >
          {isStarting ? 'Запуск камеры...' : 'Включить камеру'}
        </button>
      )}

      <div
        id={QR_REGION_ID}
        style={{ width: 300, display: isScanning ? 'block' : 'none' }}
      />

      {isScanning && (
        <button
          type="button"
          onClick={handleStop}
          style={{ marginTop: 12 }}
        >
          Остановить
        </button>
      )}

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
