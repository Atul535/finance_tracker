import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';

const MainLayout = () => {

  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="d-flex min-vh-100">
      
      {/* Sidebar */}
      <nav className="card shadow-sm border-end p-4 d-flex flex-column" style={{ width: '280px' }}>
        <h3 className="text-primary fw-bold mb-5">FinanceTracker</h3>
        
        <div className="d-flex flex-column gap-3 flex-grow-1">
          <Link to="/dashboard" className="text-dark fw-semibold text-decoration-none p-2 rounded">
            Dashboard
          </Link>
          <Link to="/transactions" className="text-secondary fw-semibold text-decoration-none p-2 rounded">
            Transactions
          </Link>
          <Link to="/categories" className="text-secondary fw-semibold text-decoration-none p-2 rounded">
            Categories
          </Link>
        </div>

        <button onClick={handleLogout} className="btn btn-outline-danger fw-bold mt-auto">
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-4">
        <div className="card shadow-sm border-0 h-100 p-4 rounded-4">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
