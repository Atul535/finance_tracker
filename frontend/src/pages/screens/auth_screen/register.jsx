import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  // 1. Setup the Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Send data to your /api/auth/register endpoint
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registered Successfully!", data);
      alert("Account created! Please log in.");
      navigate("/login");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Registration failed. Try again.";
      alert(errorMessage);
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 2. Trigger the mutation to actually save the user!
    registerMutation.mutate(formData);
  };

  return (
    <div className="card shadow border-0 p-4 rounded-4">
      <div className="card-body">
        
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Create Account</h2>
          <p className="text-muted">Start tracking your finances today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="John Doe" 
              className="form-control form-control-lg" 
              onChange={handleChange}
              required 
            />
          </div>

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

          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-100 fw-bold"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-bold text-decoration-none">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
