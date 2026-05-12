import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { AUTH_ENDPOINTS } from '../services/apiConstants';
import { notifySuccess, notifyError, } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

export const useLoginMutation = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            notifySuccess('Login Successful!');
            navigate('/dashboard');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Login Failed. Check your credentials';
            notifyError(errorMessage);
        }
    });
};

export const useRegisterMutation = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post(AUTH_ENDPOINTS.REGISTER, data);
            return response;
        },
        onSuccess: (data) => {
            notifySuccess('Registration Successful!');
            navigate('/login');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Registration Failed. Please try again.';
            notifyError(errorMessage);
        }
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    // We don't need a mutation! Just a normal function.
    return () => {
        localStorage.clear();
        notifySuccess('Logout Success');
        navigate('/login');
    };
};

