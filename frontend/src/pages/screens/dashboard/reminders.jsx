import React, { useState } from 'react';
import { useGetReminders, useCreateReminder, useMarkAsPaid, useDeleteReminder } from '../../../hooks/useReminders';

// Helper to determine status of a reminder
const getReminderStatus = (reminder) => {
    if (reminder.isPaid) return { label: 'Paid', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' };
    const today = new Date();
    const due = new Date(reminder.dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: 'Overdue', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
    if (diffDays <= 3) return { label: 'Due Soon', color: '#f97316', bg: 'rgba(249,115,22,0.15)' };
    return { label: 'Upcoming', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' };
};

const Reminders = () => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        dueDate: '',
        isRecurring: false,
        recurrence: 'MONTHLY'
    });

    const { data: reminders = [], isLoading } = useGetReminders();
    const createMutation = useCreateReminder(() => {
        setFormData({ title: '', amount: '', dueDate: '', isRecurring: false, recurrence: 'MONTHLY' });
    });
    const markPaidMutation = useMarkAsPaid();
    const deleteMutation = useDeleteReminder();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    // Sort: overdue first, then due soon, then upcoming, then paid
    const sortedReminders = [...reminders].sort((a, b) => {
        if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return (
        <div>
            <h2 className="fw-bold mb-4">Payment Reminders</h2>

            <div className="row g-4">
                {/* Add Reminder Form */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 rounded-4 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Add Reminder</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="e.g., Netflix, Rent"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control"
                                        placeholder="e.g., 649"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Due Date</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        className="form-control"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        name="isRecurring"
                                        className="form-check-input"
                                        id="isRecurring"
                                        checked={formData.isRecurring}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="isRecurring">
                                        Recurring Payment
                                    </label>
                                </div>

                                {formData.isRecurring && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Recurrence</label>
                                        <select
                                            name="recurrence"
                                            className="form-select"
                                            value={formData.recurrence}
                                            onChange={handleChange}
                                        >
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="YEARLY">Yearly</option>
                                        </select>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 fw-bold mt-2"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? 'Adding...' : 'Add Reminder'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Reminders List */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Your Reminders</h5>

                            {isLoading ? (
                                <p className="text-muted">Loading reminders...</p>
                            ) : reminders.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fs-5">No reminders yet.</p>
                                    <p className="text-muted small">Add a payment reminder to never miss a bill!</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {sortedReminders.map((reminder) => {
                                        const status = getReminderStatus(reminder);
                                        return (
                                            <div
                                                key={reminder.id}
                                                className="d-flex justify-content-between align-items-center p-3 rounded-3"
                                                style={{ backgroundColor: status.bg, border: `1px solid ${status.color}40` }}
                                            >
                                                <div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <span className="fw-bold">{reminder.title}</span>
                                                        <span
                                                            className="badge rounded-pill"
                                                            style={{ backgroundColor: status.color, fontSize: '11px' }}
                                                        >
                                                            {status.label}
                                                        </span>
                                                        {reminder.isRecurring && (
                                                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '11px' }}>
                                                                🔄 {reminder.recurrence}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="d-flex gap-3">
                                                        <small className="text-muted">
                                                            ₹{reminder.amount.toLocaleString()}
                                                        </small>
                                                        <small className="text-muted">
                                                            Due: {new Date(reminder.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </small>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    {!reminder.isPaid && (
                                                        <button
                                                            className="btn btn-sm fw-bold"
                                                            style={{ backgroundColor: '#22c55e', color: 'white' }}
                                                            onClick={() => markPaidMutation.mutate(reminder.id)}
                                                            disabled={markPaidMutation.isPending}
                                                        >
                                                            ✓ Paid
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-outline-danger fw-bold"
                                                        onClick={() => deleteMutation.mutate(reminder.id)}
                                                    >
                                                        ✕
                                                    </button>
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

export default Reminders;
