import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../services/api';
import { TRANSACTION_ENDPOINTS } from '../services/apiConstants';
import { notifyError, notifySuccess } from '../utils/toast';

export const useGetTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const response = await api.get(TRANSACTION_ENDPOINTS.GET_ALL);
            return response.data;
        },
        onError: (error) => {
            notifyError('Failed to fetch transactions');
        }
    });
};

export const useCreateTransaction = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post(TRANSACTION_ENDPOINTS.CREATE, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            notifySuccess('Transaction created successfully!');
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to create transaction';
            notifyError(message);
        }
    });
};


export const useDeleteTransaction = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await api.delete(TRANSACTION_ENDPOINTS.DELETE(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            notifySuccess('Transaction deleted successfully!');
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: () => {
            const message = error?.response?.data?.message || 'Failed to delete transaction';
            notifyError(message);
        }
    });
};