import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { PROFILE_ENDPOINTS } from '../services/apiConstants';
import { notifySuccess, notifyError } from '../utils/toast';

export const useGetProfile = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await api.get(PROFILE_ENDPOINTS.GET);
            return response.data;
        }
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData) => {
            const response = await api.put(PROFILE_ENDPOINTS.UPDATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        },
        onSuccess: (data) => {
            const oldUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...oldUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage'));
            notifySuccess('Profile updated successfully');
        },
        onError: (error) => {
            notifyError(error.response?.data?.message || 'Failed to update profile');
        }
    });
};

export const useChangePassword = (onSuccessCallback, onErrorCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.put(PROFILE_ENDPOINTS.CHANGE_PASSWORD, data);
            return response.data;
        },
        onSuccess: () => {
            notifySuccess('Password changed successfully');
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            notifyError(error.response?.data?.message || "Failed to change password");
            if (onErrorCallback) onErrorCallback();
        }
    });
};