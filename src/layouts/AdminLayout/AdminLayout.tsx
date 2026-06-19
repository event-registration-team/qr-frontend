import { Outlet } from 'react-router-dom';

import { Header } from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';

import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-layout__content">
        <Header />

        <main className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;