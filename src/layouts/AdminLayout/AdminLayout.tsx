import { Outlet, useNavigate } from 'react-router-dom';

import { Header } from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';

import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-layout__content">
        <Header />

        {/* 🔥 Быстрая кнопка сканера (временно тут, чтобы точно работало) */}
        <div style={{ padding: '10px 20px' }}>
          <button
            onClick={() => navigate('/scan')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            📷 Открыть QR-сканер
          </button>
        </div>

        <main className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;