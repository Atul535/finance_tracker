import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const loginMutation = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // 4. Trigger the mutation instead of console.log
    loginMutation.mutate(formData);
  };

  return (
    <div className="card shadow border-0 p-4 rounded-4">
      <div className="card-body">
        
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Welcome Back</h2>
          <p className="text-muted">Log in to track your finances</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="you@example.com" 
              className="form-control form-control-lg" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              className="form-control form-control-lg" 
              onChange={handleChange}
              required 
            />
          </div>
          <div className='d-flex justify-content-end'>
            <Link to="/forget-password" className="text-primary fw-bold text-decoration-none mb-2">
                Forget Password?
            </Link>
          </div>
          {/* Show a loading spinner if React Query says it's currently fetching */}
          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-100 fw-bold"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary fw-bold text-decoration-none">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
