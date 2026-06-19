interface EventFormPageProps {
  mode: 'create' | 'edit';
}

export function EventFormPage({ mode }: EventFormPageProps) {
  return (
    <div>
      {mode === 'create'
        ? 'Создание мероприятия'
        : 'Редактирование мероприятия'}
    </div>
  );
}