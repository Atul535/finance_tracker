import { useMemo } from 'react';

export const useDashboardStats = (transactions) => {
    // useMemo "remembers" the result and only recalculates if the transactions array changes!
    return useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { totalIncome: 0, totalExpense: 0, currentBalance: 0, expensesByCategory: {} };
        }

        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
        const totalExpense = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
        const currentBalance = totalIncome - totalExpense;

        const expensesByCategory = {};
        transactions
            .filter(t => t.type === 'EXPENSE')
            .forEach(t => {
                const catName = t.category?.name || 'Uncategorized';
                expensesByCategory[catName] = (expensesByCategory[catName] || 0) + parseFloat(t.amount);
            });

        return { totalIncome, totalExpense, currentBalance, expensesByCategory };
    }, [transactions]); 
};
