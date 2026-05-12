import React, { useState } from 'react';
import { useGetTransactions, useCreateTransaction, useDeleteTransaction } from '../../../hooks/useTransactions';
import { useGetCategories } from '../../../hooks/useCategories';

const Transactions = () => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    categoryId: '',
    date: today,
    notes: ''
  });

  const { data: categories = [] } = useGetCategories();
  const { data: transactions = [], isLoading } = useGetTransactions();

  const createMutation = useCreateTransaction(() => {
    setFormData({ amount: '', type: 'EXPENSE', categoryId: '', date: today, notes: '' });
  });
  
  const deleteMutation = useDeleteTransaction();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div>
      <h2 className="fw-bold mb-4">Manage Transactions</h2>

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add New Transaction</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Type</label>
                  <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select name="categoryId" className="form-select" value={formData.categoryId} onChange={handleChange} required>
                    <option value="">Select Category...</option>
                    {filteredCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-white">$</span>
                    <input type="number" step="0.01" name="amount" className="form-control border-start-0" value={formData.amount} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Date</label>
                  <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} rows="2"></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Saving...' : 'Save Transaction'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Recent Transactions</h5>
              {isLoading ? (
                <p className="text-muted">Loading transactions...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-dark table-borderless align-middle rounded overflow-hidden">
                    <thead className="table-active">
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Notes</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr><td colSpan="5" className="text-center text-muted py-4">No transactions found.</td></tr>
                      ) : (
                        transactions.map(txn => (
                          <tr key={txn.id}>
                            <td>{new Date(txn.date).toLocaleDateString()}</td>
                            <td>
                              <span className="badge" style={{ backgroundColor: txn.category?.color || '#6c757d' }}>
                                {txn.category?.name || 'Unknown'}
                              </span>
                            </td>
                            <td className="text-muted">{txn.notes || '-'}</td>
                            <td className={`fw-bold ${txn.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
                              {txn.type === 'INCOME' ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                            </td>
                            <td>
                              <button onClick={() => deleteMutation.mutate(txn.id)} className="btn btn-sm btn-outline-danger" disabled={deleteMutation.isPending}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
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

export default Transactions;
