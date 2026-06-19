import './LoginPage.css';

export function LoginPage() {
  return (
    <section className="login-page">
      <div className="login-page__brand">
        <div className="login-page__logo">▦</div>
        <h1>EventPass</h1>
        <p>Система регистрации мероприятий</p>
      </div>

      <form className="login-card">
        <h2>Вход в систему</h2>

        <label>
          Email
          <input
            type="email"
            defaultValue="admin@eventpass.ru"
            placeholder="Введите email"
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            defaultValue="12345678"
            placeholder="Введите пароль"
          />
        </label>

        <div className="login-card__row">
          <label className="login-card__checkbox">
            <input type="checkbox" defaultChecked />
            Запомнить меня
          </label>

          <button type="button" className="login-card__link">
            Забыли пароль?
          </button>
        </div>

        <button type="submit" className="login-card__submit">
          Войти
        </button>
      </form>
    </section>
  );
}