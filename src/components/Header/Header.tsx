import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__icon">▦</div>
        <strong>EventPass</strong>
        <span>· Система регистрации мероприятий с QR-кодами</span>
      </div>

      <div className="header__tabs">
        <button className="header__tab header__tab--active" type="button">
          Административная панель
        </button>
        <button className="header__tab" type="button">
          Публичная часть (мобайл)
        </button>
      </div>
    </header>
  );
}