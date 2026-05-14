import React, { useState } from 'react';
import { useGetCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../../hooks/useCategories';

const Categories = () => {
  const [formData, setFormData] = useState({ name: '', type: 'EXPENSE', color: '#6366f1' });
  const [editingCategory, setEditingCategory] = useState(null);

   const { data: categories = [], isLoading } = useGetCategories();
  const createMutation = useCreateCategory(() => {
    setFormData({ name: '', type: 'EXPENSE', color: '#6366f1' }); 
  });
  const deleteMutation = useDeleteCategory();

  const updateMutation = useUpdateCategory(() => {
    setEditingCategory(null); // Close the modal on success
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingCategory({ ...editingCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
    console.log("Create Category:", formData);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Pass the id and the updated data to our fixed hook!
    updateMutation.mutate({
      id: editingCategory.id,
      name: editingCategory.name,
      type: editingCategory.type,
      color: editingCategory.color
    });
  };

  const handleDelete = (id) => {
     if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
     }
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
                      <div className="d-flex gap-2">
                        {/* NEW: Edit Button */}
                        <button onClick={() => setEditingCategory(cat)} className="btn btn-sm btn-outline-primary fw-bold px-3">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-outline-danger fw-bold px-3">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Edit Category Modal (Only visible when editingCategory is not null) */}
      {editingCategory && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold">Edit Category</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingCategory(null)}></button>
                </div>
                <div className="modal-body p-4">
                  <form onSubmit={handleEditSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Category Name</label>
                      <input type="text" name="name" className="form-control" value={editingCategory.name} onChange={handleEditChange} required />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Type</label>
                      <select name="type" className="form-select" value={editingCategory.type} onChange={handleEditChange}>
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Color</label>
                      <input type="color" name="color" className="form-control form-control-color w-100" value={editingCategory.color} onChange={handleEditChange} />
                    </div>
                    <div className="d-flex gap-2 justify-content-end mt-4">
                      <button type="button" className="btn btn-light fw-bold" onClick={() => setEditingCategory(null)}>Cancel</button>
                      <button type="submit" className="btn btn-primary fw-bold" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
