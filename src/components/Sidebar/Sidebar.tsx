import { NavLink } from 'react-router-dom';

import { ROUTES } from '../../router/routes';

import './Sidebar.css';

const menuItems = [
  { title: 'Панель управления', path: ROUTES.dashboard, icon: '▥' },
  { title: 'Мероприятия', path: ROUTES.events, icon: '▣' },
  { title: 'Участники', path: ROUTES.participants, icon: '♙' },
  { title: 'Статистика', path: ROUTES.statistics, icon: '▥' },
  { title: 'Импорт / Экспорт', path: ROUTES.importExport, icon: '▤' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">▦</div>
        <strong>EventPass</strong>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
          >
            <span>{item.icon}</span>
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}