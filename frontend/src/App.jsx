import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './pages/layout/authLayout';
import MainLayout from './pages/layout/mainLayout';
import Login from './pages/screens/auth_screen/login';
import Register from './pages/screens/auth_screen/register';
import Categories from './pages/screens/dashboard/categories';
import Profile from './pages/screens/dashboard/profile';
import Dashboard from './pages/screens/dashboard/dashboard';
import Budget from './pages/screens/dashboard/budget';
import {Toaster} from 'react-hot-toast';
import './App.css';
import Transactions from './pages/screens/dashboard/transactions';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        
        {/* Auth Routes wrapped in AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
