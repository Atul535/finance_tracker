import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../services/api';
import { CATEGORY_ENDPOINTS } from '../services/apiConstants';
import { notifySuccess, notifyError } from "../utils/toast";

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get(CATEGORY_ENDPOINTS.GET_ALL);
            return response.data;
        }
    });
};

export const useCreateCategory = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post(CATEGORY_ENDPOINTS.CREATE, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            notifySuccess("Category created successfully!");
            if (onSuccessCallback) onSuccessCallback(); // Clears the form in UI
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Category creation failed. Please try again.';
            notifyError(errorMessage);
        }
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await api.delete(CATEGORY_ENDPOINTS.DELETE(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            notifySuccess("Category deleted successfully!");
        }
    });
};

export const useUpdateCategory = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await api.put(CATEGORY_ENDPOINTS.UPDATE(id), data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            notifySuccess("Category updated successfully!");
            if (onSuccessCallback) onSuccessCallback(); // Closes the edit modal if you have one
        }
    });
};