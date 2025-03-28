import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  addBudget, 
  updateBudget, 
  deleteBudget, 
  addBudgetCategory, 
  updateBudgetCategory, 
  deleteBudgetCategory 
} from '../store/slices/budgetSlice';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  spent: number;
}

interface Budget {
  id: string;
  name: string;
  period: string;
  categories: BudgetCategory[];
  totalAmount: number;
  totalSpent: number;
}

const Budget: React.FC = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state: RootState) => state.budget);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [budgetFormData, setBudgetFormData] = useState<Partial<Budget>>({
    name: '',
    period: 'monthly',
    categories: [],
    totalAmount: 0,
    totalSpent: 0,
  });
  const [categoryFormData, setCategoryFormData] = useState<Partial<BudgetCategory>>({
    name: '',
    amount: 0,
    spent: 0,
  });

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget) {
      dispatch(updateBudget({ id: editingBudget.id, ...budgetFormData }));
    } else {
      dispatch(addBudget(budgetFormData as Budget));
    }
    handleCloseBudgetForm();
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget) return;

    if (editingCategory) {
      dispatch(updateBudgetCategory({
        budgetId: selectedBudget.id,
        category: { id: editingCategory.id, ...categoryFormData } as BudgetCategory,
      }));
    } else {
      dispatch(addBudgetCategory({
        budgetId: selectedBudget.id,
        category: categoryFormData as BudgetCategory,
      }));
    }
    handleCloseCategoryForm();
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetFormData(budget);
    setShowBudgetForm(true);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setCategoryFormData(category);
    setShowCategoryForm(true);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      dispatch(deleteBudget(id));
    }
  };

  const handleDeleteCategory = (budgetId: string, categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteBudgetCategory({ budgetId, categoryId }));
    }
  };

  const handleCloseBudgetForm = () => {
    setShowBudgetForm(false);
    setEditingBudget(null);
    setBudgetFormData({
      name: '',
      period: 'monthly',
      categories: [],
      totalAmount: 0,
      totalSpent: 0,
    });
  };

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      amount: 0,
      spent: 0,
    });
  };

  const chartData = selectedBudget ? {
    labels: selectedBudget.categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Spent',
        data: selectedBudget.categories.map(cat => cat.spent),
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
      },
      {
        label: 'Budgeted',
        data: selectedBudget.categories.map(cat => cat.amount),
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Budget vs. Actual Spending',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="budget-page">
      <div className="page-header">
        <h1>Budget Management</h1>
        <button className="btn btn-primary" onClick={() => setShowBudgetForm(true)}>
          Create Budget
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showBudgetForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingBudget ? 'Edit Budget' : 'Create Budget'}</h2>
            <form onSubmit={handleBudgetSubmit}>
              <div className="form-group">
                <label className="form-label">Budget Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={budgetFormData.name}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Period</label>
                <select
                  className="form-control"
                  value={budgetFormData.period}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, period: e.target.value })}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingBudget ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-outline" onClick={handleCloseBudgetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryForm && selectedBudget && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Budgeted Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={categoryFormData.amount}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, amount: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update' : 'Add'}
                </button>
                <button type="button" className="btn btn-outline" onClick={handleCloseCategoryForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="budgets-grid">
          {budgets.map((budget) => (
            <div key={budget.id} className="budget-card">
              <div className="budget-header">
                <h3>{budget.name}</h3>
                <div className="budget-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditBudget(budget)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="budget-info">
                <p>Period: {budget.period}</p>
                <p>Total Budgeted: ${budget.totalAmount.toLocaleString()}</p>
                <p>Total Spent: ${budget.totalSpent.toLocaleString()}</p>
                <p>Remaining: ${(budget.totalAmount - budget.totalSpent).toLocaleString()}</p>
              </div>
              <div className="budget-categories">
                <div className="categories-header">
                  <h4>Categories</h4>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedBudget(budget);
                      setShowCategoryForm(true);
                    }}
                  >
                    Add Category
                  </button>
                </div>
                <div className="categories-list">
                  {budget.categories.map((category) => (
                    <div key={category.id} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{category.name}</span>
                        <span className="category-amount">
                          ${category.spent.toLocaleString()} / ${category.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="category-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteCategory(budget.id, category.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {chartData && (
                <div className="budget-chart">
                  <h4>Spending by Category</h4>
                  <Bar options={chartOptions} data={chartData} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budget; 