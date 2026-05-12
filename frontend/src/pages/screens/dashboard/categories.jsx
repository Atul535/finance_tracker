import React, { useState } from 'react';
import { useGetCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../../hooks/useCategories';

const Categories = () => {
  const [formData, setFormData] = useState({ name: '', type: 'EXPENSE', color: '#6366f1' });

   const { data: categories = [], isLoading } = useGetCategories();
  const createMutation = useCreateCategory(() => {
    setFormData({ name: '', type: 'EXPENSE', color: '#6366f1' }); 
  });
  const deleteMutation = useDeleteCategory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
    console.log("Create Category:", formData);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    console.log("Delete Category:", id);
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Manage Categories</h2>

      <div className="row g-4">
        {/* Form to Add Category */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add New Category</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category Name</label>
                  <input type="text" name="name" className="form-control" placeholder="e.g., Rent" onChange={handleChange} required />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Type</label>
                  <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Color</label>
                  <input type="color" name="color" className="form-control form-control-color w-100" value={formData.color} onChange={handleChange} title="Choose your color" />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold">Add Category</button>
              </form>
            </div>
          </div>
        </div>

        {/* List of Categories */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Your Categories</h5>
              
              {categories.length === 0 ? (
                <p className="text-muted">No categories found. Create one to get started!</p>
              ) : (
                <div className="list-group list-group-flush">
                  {categories.map((cat) => (
                    <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        {/* A tiny color circle indicator */}
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: cat.color }}></div>
                        <span className="fw-semibold">{cat.name}</span>
                        {/* A dynamic bootstrap badge for Income vs Expense */}
                        <span className={`badge ${cat.type === 'INCOME' ? 'bg-success' : 'bg-danger'}`}>
                          {cat.type}
                        </span>
                      </div>
                      <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
