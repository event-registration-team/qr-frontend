import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

import { eventService, type ApiEvent } from '../../services/eventService';
import {
  participantService,
  type ApiParticipant,
  type CreateParticipant,
} from '../../services/participantService';

import './ImportExportPage.css';

type ExportType = 'all' | 'visited' | 'not_visited';

type ImportRow = {
  Фамилия?: string;
  Имя?: string;
  Отчество?: string;
  Email?: string;
  Телефон?: string;
  'Номер авто'?: string;
};

function formatDate(value?: string | null) {
  if (!value) return '';

  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim();
}

export default function ImportExportPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [importEventId, setImportEventId] = useState<number | null>(null);
  const [exportEventId, setExportEventId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportType, setExportType] = useState<ExportType>('all');

  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    eventService
      .getEvents()
      .then((loadedEvents) => {
        setEvents(loadedEvents);

        if (loadedEvents.length > 0) {
          setImportEventId(loadedEvents[0].id);
          setExportEventId(loadedEvents[0].id);
        }
      })
      .catch(() => {
        setError('Не удалось загрузить мероприятия');
      });
  }, []);

  const selectedImportEvent = useMemo(
    () => events.find((event) => event.id === importEventId),
    [events, importEventId],
  );

  const selectedExportEvent = useMemo(
    () => events.find((event) => event.id === exportEventId),
    [events, exportEventId],
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setMessage('');
    setError('');
  }

  async function handleImport() {
    if (!selectedFile || !importEventId) {
      setError('Выберите мероприятие и Excel-файл');
      return;
    }

    setIsImporting(true);
    setMessage('');
    setError('');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rows = XLSX.utils.sheet_to_json<ImportRow>(worksheet);

      if (rows.length === 0) {
        setError('Файл пустой');
        return;
      }

      const participants: CreateParticipant[] = rows
        .map((row) => ({
          event_id: importEventId,
          last_name: normalizeText(row['Фамилия']),
          first_name: normalizeText(row['Имя']),
          middle_name: normalizeText(row['Отчество']) || null,
          email: normalizeText(row['Email']),
          phone: normalizeText(row['Телефон']) || null,
          car_number: normalizeText(row['Номер авто']) || null,
        }))
        .filter(
          (participant) =>
            participant.last_name &&
            participant.first_name &&
            participant.email,
        );

      if (participants.length === 0) {
        setError('В файле нет строк с Фамилия, Имя и Email');
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const participant of participants) {
        try {
          await participantService.registerParticipant(participant);
          successCount += 1;
        } catch {
          failCount += 1;
        }
      }

      setMessage(
        `Импорт завершён. Добавлено: ${successCount}. Ошибок: ${failCount}.`,
      );
      setSelectedFile(null);
    } catch {
      setError('Не удалось импортировать файл');
    } finally {
      setIsImporting(false);
    }
  }

  async function handleExport() {
    if (!exportEventId) {
      setError('Выберите мероприятие для экспорта');
      return;
    }

    setIsExporting(true);
    setMessage('');
    setError('');

    try {
      const participants =
        await participantService.getParticipantsByEventId(exportEventId);

      const filteredParticipants = participants.filter((participant) => {
        if (exportType === 'visited') {
          return participant.visit_status === 'visited';
        }

        if (exportType === 'not_visited') {
          return participant.visit_status !== 'visited';
        }

        return true;
      });

      const exportRows = filteredParticipants.map((participant) => ({
        ФИО: [
          participant.last_name,
          participant.first_name,
          participant.middle_name,
        ]
          .filter(Boolean)
          .join(' '),
        Email: participant.email,
        Телефон: participant.phone || '',
        'Номер авто': participant.car_number || '',
        'Дата регистрации': formatDate(participant.registered_at),
        Статус:
          participant.visit_status === 'visited'
            ? 'Посетил'
            : 'Зарегистрирован',
        'Время прохода': formatDate(participant.checked_in_at),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Участники');

      const eventTitle = selectedExportEvent?.title || 'event';
      XLSX.writeFile(workbook, `participants_${eventTitle}.xlsx`);

      setMessage(`Экспортировано участников: ${exportRows.length}`);
    } catch {
      setError('Не удалось экспортировать участников');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="import-export-page">
      <div className="import-export-page__header">
        <div>
          <h1>Импорт и экспорт участников</h1>
          <p>Управление списками участников через Excel-файлы</p>
        </div>
      </div>

      {(message || error) && (
        <div
          className={
            error
              ? 'import-export-page__alert import-export-page__alert--error'
              : 'import-export-page__alert'
          }
        >
          {error || message}
        </div>
      )}

      <div className="import-export-page__grid">
        <div className="import-export-card">
          <div className="import-export-card__title">
            <span>⇧</span>
            <div>
              <h2>Импорт из Excel</h2>
              <p>Загрузите список участников</p>
            </div>
          </div>

          <label className="import-export-card__label">
            Мероприятие
            <select
              value={importEventId ?? ''}
              onChange={(event) => setImportEventId(Number(event.target.value))}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <label className="import-export-dropzone">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />

            <span className="import-export-dropzone__icon">⇧</span>

            {selectedFile ? (
              <>
                <strong>{selectedFile.name}</strong>
                <small>Файл выбран</small>
              </>
            ) : (
              <>
                <strong>Перетащите файл сюда</strong>
                <small>или нажмите для выбора</small>
                <small>Поддерживаемые форматы: .xlsx, .xls</small>
              </>
            )}
          </label>

          <button
            type="button"
            className="import-export-card__button"
            disabled={!selectedFile || !importEventId || isImporting}
            onClick={handleImport}
          >
            {isImporting ? 'Загрузка...' : 'Загрузить участников'}
          </button>
        </div>

        <div className="import-export-card">
          <div className="import-export-card__title">
            <span>⇩</span>
            <div>
              <h2>Экспорт в Excel</h2>
              <p>Скачайте данные участников</p>
            </div>
          </div>

          <label className="import-export-card__label">
            Мероприятие
            <select
              value={exportEventId ?? ''}
              onChange={(event) => setExportEventId(Number(event.target.value))}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <div className="import-export-card__radio-group">
            <strong>Тип экспорта</strong>

            <label>
              <input
                type="radio"
                checked={exportType === 'all'}
                onChange={() => setExportType('all')}
              />
              Все участники
            </label>

            <label>
              <input
                type="radio"
                checked={exportType === 'visited'}
                onChange={() => setExportType('visited')}
              />
              Только посетившие
            </label>

            <label>
              <input
                type="radio"
                checked={exportType === 'not_visited'}
                onChange={() => setExportType('not_visited')}
              />
              Не посетившие
            </label>
          </div>

          <div className="import-export-fields">
            <strong>Поля в выгрузке:</strong>

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

          <button
            type="button"
            className="import-export-card__button import-export-card__button--green"
            disabled={!exportEventId || isExporting}
            onClick={handleExport}
          >
            {isExporting ? 'Подготовка...' : 'Скачать Excel'}
          </button>
        </div>
      </div>

      <div className="import-export-page__note">
        ⚠ Формат файла импорта: файл должен содержать колонки Фамилия, Имя,
        Email. Первая строка — заголовки.
      </div>
    </section>
  );
}