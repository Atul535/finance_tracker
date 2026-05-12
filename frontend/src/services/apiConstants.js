export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register'
};

export const CATEGORY_ENDPOINTS = {
    GET_ALL: '/categories/get',
    CREATE: '/categories/create',
    DELETE: (id) => `/categories/delete/${id}`,
    UPDATE: (id) => `/categories/update/${id}`
};