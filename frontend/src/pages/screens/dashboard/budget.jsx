import React, {useState} from 'react';
import { useGetBudget, useSetBudget, useDeletebudget } from '../../../hooks/useBudget';
import { useGetCategories } from  '../../../hooks/useCategories';


// Helper to get progress bar color based on percentage
const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#ef4444'; // Red - Over budget
    if (percentage >= 80) return '#f97316';  // Orange - Warning
    if (percentage >= 50) return '#eab308';  // Yellow - Caution
    return '#22c55e';                        // Green - Healthy
};
const Budget = () => {
    const [formData, setFormData] = useState({ categoryId: '', amount: '' });
    const { data: budgets = [], isLoading: loadingBudgets } = useGetBudget();
    // Only show EXPENSE categories (budgets are for spending limits)
    const { data: allCategories = [] } = useGetCategories();
    const expenseCategories = allCategories.filter(c => c.type === 'EXPENSE');
    const setBudgetMutation = useSetBudget(() => {
        setFormData({ categoryId: '', amount: '' });
    });
    const deleteBudgetMutation = useDeletebudget();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setBudgetMutation.mutate({
            categoryId: parseInt(formData.categoryId),
            amount: parseFloat(formData.amount)
        });
    };
    // Find categories that don't have a budget yet (so users can only add one per category)
    const budgetedCategoryIds = new Set(budgets.map(b => b.categoryId));
    const availableCategories = expenseCategories.filter(c => !budgetedCategoryIds.has(c.id));
    return (
        <div>
            <h2 className="fw-bold mb-4">Budgets & Tracking</h2>
            <div className="row g-4">
                {/* Set Budget Form */}
                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Set a Budget</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Expense Category</label>
                                    <select
                                        name="categoryId"
                                        className="form-select"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a category...</option>
                                        {availableCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {availableCategories.length === 0 && (
                                        <p className="text-muted small mt-1">All expense categories have budgets!</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Monthly Limit (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control"
                                        placeholder="e.g., 5000"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 fw-bold"
                                    disabled={setBudgetMutation.isPending}
                                >
                                    {setBudgetMutation.isPending ? 'Saving...' : 'Save Budget'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Budget Progress Cards */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Monthly Spending Overview</h5>
                            {loadingBudgets ? (
                                <p className="text-muted">Loading budgets...</p>
                            ) : budgets.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fs-5">No budgets set yet.</p>
                                    <p className="text-muted small">Set a monthly limit for an expense category to start tracking!</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-4">
                                    {budgets.map((budget) => {
                                        const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
                                        const isOver = budget.spent > budget.amount;
                                        const progressColor = getProgressColor(percentage);
                                        
                                        return (
                                            <div key={budget.id}>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        {/* Category color dot */}
                                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: budget.category.color }}></div>
                                                        <span className="fw-semibold">{budget.category.name}</span>
                                                        {isOver && (
                                                            <span className="badge bg-danger">Over Budget!</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger py-0 px-2"
                                                        onClick={() => deleteBudgetMutation.mutate(budget.id)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="progress rounded-pill mb-1" style={{ height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                                    <div
                                                        className="progress-bar rounded-pill"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: progressColor,
                                                            transition: 'width 0.6s ease'
                                                        }}
                                                        aria-valuenow={percentage}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                {/* Spent vs Budget text */}
                                                <div className="d-flex justify-content-between">
                                                    <small className="text-muted">
                                                        Spent: <span style={{ color: progressColor }} className="fw-semibold">₹{budget.spent.toLocaleString()}</span>
                                                    </small>
                                                    <small className="text-muted">
                                                        Limit: <span className="fw-semibold">₹{budget.amount.toLocaleString()}</span>
                                                    </small>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Budget;