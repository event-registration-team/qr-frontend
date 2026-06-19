import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div>
        <p className="header__subtitle">Административная панель</p>
        <h1 className="header__title">QR Event Registration</h1>
      </div>

      <button type="button" className="header__logout">
        Выйти
      </button>
    </header>
  );
}