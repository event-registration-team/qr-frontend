import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__icon">▦</div>
        <strong>EventPass</strong>
        <span>· Система регистрации мероприятий с QR-кодами</span>
      </div>

    </header>
  );
}