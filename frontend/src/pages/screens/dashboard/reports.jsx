import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useGetMonthlyReport, useGetCategoryBreakdown } from '../../../hooks/useReports';
import { useGetTransactions } from '../../../hooks/useTransactions';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Helper: format "2026-05" -> "May 2026"
const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
};

// CSV Export helper
const exportToCSV = (transactions) => {
    if (!transactions || transactions.length === 0) return;
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes'];
    const rows = transactions.map(tx => [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        tx.category?.name || '',
        tx.amount,
        tx.notes || ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions_report.csv';
    a.click();
    URL.revokeObjectURL(url);
};

const Reports = () => {
    const { data: monthlySummary = [], isLoading: loadingMonthly } = useGetMonthlyReport();
    const { data: categoryBreakdown = [], isLoading: loadingCategory } = useGetCategoryBreakdown();
    const { data: transactions = [] } = useGetTransactions();

    // Calculate totals from monthly summary
    const totalIncome = monthlySummary.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = monthlySummary.reduce((sum, m) => sum + m.expense, 0);
    const netSavings = totalIncome - totalExpense;

    // Bar chart config
    const barData = {
        labels: monthlySummary.map(m => formatMonth(m.month)),
        datasets: [
            {
                label: 'Income',
                data: monthlySummary.map(m => m.income),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22c55e',
                borderWidth: 1,
                borderRadius: 6
            },
            {
                label: 'Expenses',
                data: monthlySummary.map(m => m.expense),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 1,
                borderRadius: 6
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#f8fafc' } },
            title: { display: false }
        },
        scales: {
            x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    };

    // Doughnut chart config
    const doughnutData = {
        labels: categoryBreakdown.map(c => c.name),
        datasets: [{
            data: categoryBreakdown.map(c => c.total),
            backgroundColor: categoryBreakdown.map(c => c.color || '#6366f1'),
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 2
        }]
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f8fafc', padding: 15, font: { size: 12 } }
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Financial Reports</h2>
                <button
                    className="btn btn-outline-primary fw-bold"
                    onClick={() => exportToCSV(transactions)}
                >
                    ⬇ Export CSV
                </button>
            </div>

            {/* Summary Cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm p-3">
                        <p className="text-muted small mb-1 fw-semibold">Total Income</p>
                        <h4 className="fw-bold" style={{ color: '#22c55e' }}>₹{totalIncome.toLocaleString()}</h4>
                        <small className="text-muted">Last 6 months</small>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm p-3">
                        <p className="text-muted small mb-1 fw-semibold">Total Expenses</p>
                        <h4 className="fw-bold" style={{ color: '#ef4444' }}>₹{totalExpense.toLocaleString()}</h4>
                        <small className="text-muted">Last 6 months</small>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm p-3">
                        <p className="text-muted small mb-1 fw-semibold">Net Savings</p>
                        <h4 className="fw-bold" style={{ color: netSavings >= 0 ? '#22c55e' : '#ef4444' }}>
                            ₹{Math.abs(netSavings).toLocaleString()}
                        </h4>
                        <small className="text-muted">{netSavings >= 0 ? 'Surplus' : 'Deficit'}</small>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4">
                {/* Monthly Bar Chart */}
                <div className="col-12 col-lg-7">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Monthly Income vs Expenses</h5>
                            {loadingMonthly ? (
                                <p className="text-muted">Loading chart...</p>
                            ) : monthlySummary.length === 0 ? (
                                <p className="text-muted">No transaction data to display.</p>
                            ) : (
                                <Bar data={barData} options={barOptions} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Doughnut Chart */}
                <div className="col-12 col-lg-5">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Expenses by Category</h5>
                            {loadingCategory ? (
                                <p className="text-muted">Loading chart...</p>
                            ) : categoryBreakdown.length === 0 ? (
                                <p className="text-muted">No expense data to display.</p>
                            ) : (
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown Table */}
            {categoryBreakdown.length > 0 && (
                <div className="card border-0 rounded-4 shadow-sm mt-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Category Breakdown</h5>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead>
                                    <tr className="text-muted small">
                                        <th>Category</th>
                                        <th>Total Spent</th>
                                        <th>Share</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryBreakdown.map((cat) => (
                                        <tr key={cat.name}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }}></div>
                                                    <span className="fw-semibold">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="fw-semibold">₹{cat.total.toLocaleString()}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1 rounded-pill" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                                        <div
                                                            className="progress-bar rounded-pill"
                                                            style={{
                                                                width: `${(cat.total / totalExpense * 100).toFixed(1)}%`,
                                                                backgroundColor: cat.color
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <small className="text-muted">{(cat.total / totalExpense * 100).toFixed(1)}%</small>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
