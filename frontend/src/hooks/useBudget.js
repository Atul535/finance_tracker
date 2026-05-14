import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { BUDGET_ENDPOINTS } from '../services/apiConstants';
import { notifySuccess, notifyError } from '../utils/toast';

export const useGetBudget = () => {
    return useQuery({
        queryKey: ['budget'],
        queryFn: async () => {
            const response = await api.get(BUDGET_ENDPOINTS.GET_ALL);
            return response.data;
        },
        onError: (error) => {
            notifyError("Failed to fetch budgets..");
        }
    });
};

export const useSetBudget = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post(BUDGET_ENDPOINTS.CREATE, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budget'] });
            notifySuccess("Budget saved successfully");
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            notifyError(error.response?.data?.message || "Error in creating budget");
        }
    });
};

export const useDeletebudget =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(id)=>{
            await api.delete(BUDGET_ENDPOINTS.DELETE(id));
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['budget']});
            notifySuccess("Budget deleted successfully");
        },
        onError:(error)=>{
            notifyError(error.response?.data?.message || "Error in deleting budget");
        }
    });
};