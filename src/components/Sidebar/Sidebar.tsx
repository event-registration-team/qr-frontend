import { NavLink } from 'react-router-dom';

import { ROUTES } from '../../router/routes';

import './Sidebar.css';

const menuItems = [
  {
    title: 'Dashboard',
    path: ROUTES.dashboard,
  },
  {
    title: 'Мероприятия',
    path: ROUTES.events,
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Event Admin</div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}