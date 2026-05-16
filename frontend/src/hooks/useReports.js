import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { REPORT_ENDPOINTS } from '../services/apiConstants';
import { notifyError, notifySuccess } from '../utils/toast';

export const useGetMonthlyReport = () => {
    return useQuery({
        queryKey: ['reports-monthly'],
        queryFn: async ()=>{
            const response = await api.get(REPORT_ENDPOINTS.MONTHLY);
            return response.data;
        },
        onError:()=>notifyError('Failed to load monthly report.'),
    });
};

export const useGetCategoryBreakdown = () =>{
    return useQuery({
        queryKey:['reports-category'],
        queryFn: async ()=>{
            const response = await api.get(REPORT_ENDPOINTS.CATEGORY_BREAKDOWN);
            return response.data;
        },
        onError:()=>notifyError('Failed to load category breakdown.'),
    });
};