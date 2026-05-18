export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forget-password',
    RESET_PASSWORD: '/auth/reset-password',
};

export const CATEGORY_ENDPOINTS = {
    GET_ALL: '/categories/get',
    CREATE: '/categories/create',
    DELETE: (id) => `/categories/delete/${id}`,
    UPDATE: (id) => `/categories/update/${id}`
};

export const TRANSACTION_ENDPOINTS = {
    GET_ALL: '/transactions/get',
    CREATE: '/transactions/create',
    DELETE: (id) => `/transactions/delete/${id}`
};

export const PROFILE_ENDPOINTS = {
    UPDATE: '/profile/update',
    GET: '/profile/get',
    CHANGE_PASSWORD: '/profile/change-password'
};

export const BUDGET_ENDPOINTS = {
    GET: '/budget/get',
    CREATE: '/budget/create',
    DELETE: (id) => `/budget/delete/${id}`
};

export const REPORT_ENDPOINTS = {
    MONTHLY: '/reports/monthly',
    CATEGORY_BREAKDOWN: '/reports/category'
};

export const REMINDER_ENDPOINTS = {
    CREATE: '/reminders/create',
    GET: '/reminders/get',
    MARK_PAID: (id) => `/reminders/mark-paid/${id}`,
    DELETE: (id) => `/reminders/delete/${id}`
};

