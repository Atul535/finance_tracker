import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
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
          <NavLink to="/dashboard" className={({ isActive }) => `fw-semibold text-decoration-none p-2 rounded ${isActive ? 'text-white bg-primary bg-opacity-25' : 'text-secondary'}`}>
            Dashboard
          </NavLink>
          
          <NavLink to="/transactions" className={({ isActive }) => `fw-semibold text-decoration-none p-2 rounded ${isActive ? 'text-white bg-primary bg-opacity-25' : 'text-secondary'}`}>
            Transactions
          </NavLink>
          
          <NavLink to="/categories" className={({ isActive }) => `fw-semibold text-decoration-none p-2 rounded ${isActive ? 'text-white bg-primary bg-opacity-25' : 'text-secondary'}`}>
            Categories
          </NavLink>
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
