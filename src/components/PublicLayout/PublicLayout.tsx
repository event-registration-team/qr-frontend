import { Outlet } from 'react-router-dom';
import './PublicLayout.css';

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <span className="public-layout__logo">
          EventPass · Система регистрации мероприятий с QR-кодами
        </span>
      </header>
      <main className="public-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
