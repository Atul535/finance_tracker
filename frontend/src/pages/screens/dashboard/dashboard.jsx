import React from 'react';
import { useGetTransactions } from '../../../hooks/useTransactions';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    // 1. Fetch our data using the hook we already built!
    const { data: transactions = [], isLoading } = useGetTransactions();

     // 2. Crunch the numbers using our clean custom hook!
    const { 
        totalIncome, 
        totalExpense, 
        currentBalance, 
        expensesByCategory 
    } = useDashboardStats(transactions);

    if (isLoading) {
        return <p className="text-muted">Loading your financial overview...</p>;
    }

    // 3. Configure the Chart
    const chartData = {
        labels: Object.keys(expensesByCategory),
        datasets: [
            {
                data: Object.values(expensesByCategory),
                backgroundColor: [
                    '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
                    '#0ea5e9', '#6366f1', '#d946ef', '#f43f5e'
                ], // Vibrant colors for our slices
                borderWidth: 0,
                hoverOffset: 10
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f8fafc', padding: 20 } // White text for dark mode
            }
        },
        cutout: '75%' // Makes it a sleek doughnut
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">Financial Overview</h2>

            {/* Top Row: Summary Metric Cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm border-0 rounded-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <div className="card-body p-4">
                            <p className="text-success fw-bold mb-1">Total Income</p>
                            <h3 className="fw-bold text-success m-0">+${totalIncome.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm border-0 rounded-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <div className="card-body p-4">
                            <p className="text-danger fw-bold mb-1">Total Expenses</p>
                            <h3 className="fw-bold text-danger m-0">-${totalExpense.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm border-0 rounded-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                        <div className="card-body p-4">
                            <p className="text-primary fw-bold mb-1">Current Balance</p>
                            <h3 className="fw-bold text-primary m-0">${currentBalance.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: The Beautiful Doughnut Chart */}
                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body p-4 d-flex flex-column align-items-center">
                            <h5 className="fw-bold mb-4 w-100">Expenses by Category</h5>
                            {Object.keys(expensesByCategory).length === 0 ? (
                                <p className="text-muted text-center my-auto">No expenses recorded yet.</p>
                            ) : (
                                <div style={{ width: '100%', maxWidth: '280px', margin: 'auto' }}>
                                    <Doughnut data={chartData} options={chartOptions} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Transaction History */}
                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Recent Activity</h5>
                            {transactions.length === 0 ? (
                                <p className="text-muted text-center my-5">No recent transactions.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-dark table-hover table-borderless align-middle rounded overflow-hidden mb-0">
                                        <tbody>
                                            {transactions.slice(0, 5).map(txn => (
                                                <tr key={txn.id}>
                                                    <td className="py-3">
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-bold">{txn.category?.name || 'Unknown'}</span>
                                                            <small className="text-muted">{new Date(txn.date).toLocaleDateString()}</small>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted py-3">{txn.notes || '-'}</td>
                                                    <td className={`text-end fw-bold py-3 ${txn.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
                                                        {txn.type === 'INCOME' ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
