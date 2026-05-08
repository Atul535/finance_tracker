import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // 1. Setup React Query Mutation
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // This sends the POST request to our Axios instance (which points to Render)
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      // 2. What happens when login is successful?
      console.log("Login Success!", data);
      
      // Save tokens in the browser so the user stays logged in
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to the dashboard!
      navigate('/dashboard');
    },
    onError: (error) => {
      // 3. What happens if they use the wrong password?
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    }
  });

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
