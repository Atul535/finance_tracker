import { toast } from 'react-hot-toast';

export const notifySuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        style: {
            borderRadius: '10px',
            background: '#1c8012ff',
            color: '#fff',
        },
    });
};

export const notifyError = (message) => {
    toast.error(message, {
        duration: 4000,
        style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#fff',
        },
    });
};

export const notifyWarn = (message) => {
    toast.warn(message, {
        duration: 3000,
        style: {
            borderRadius: '10px',
            background: '#ada316ff',
            color: '#fff',
        },
    });
};

export const notifyLoading = (message) => {
    toast.loading(message, {
        duration: 3000,
        style: {
            borderRadius: '10px',
            background: '#3d96b1ff',
            color: '#fff',
        },
    });
};