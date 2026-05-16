import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../services/api';
import { REMINDER_ENDPOINTS } from '../services/apiConstants';
import { notifySuccess, notifyError } from '../utils/toast';

export const useGetReminders = () => {
    return useQuery({
        queryKey: ["reminders"],
        queryFn: async () => {
            const response = await api.get(REMINDER_ENDPOINTS.GET);
            return response.data;
        },
        onError: (err) => {
            notifyError(err.response?.data?.message || "Failed to fetch reminders");
        }
    });
};

export const useCreateReminder = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post(REMINDER_ENDPOINTS.CREATE, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
            notifySuccess(data.message);
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            notifyError(error.response?.data?.message || "Failed to create reminder");
        }
    });
};

export const useMarkAsPaid = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.patch(REMINDER_ENDPOINTS.MARK_PAID(id));
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
            notifySuccess(data.message);
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            notifyError(error.response?.data?.message || "Failed to mark as paid");
        }
    });
};

export const useDeleteReminder = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(REMINDER_ENDPOINTS.DELETE(id));
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
            notifySuccess(data.message);
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            notifyError(error.response?.data?.message || "Failed to delete reminder");
        }
    });
};