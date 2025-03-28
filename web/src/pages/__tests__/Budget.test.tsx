import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Budget from '../Budget';
import budgetReducer from '../../store/slices/budgetSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      budget: budgetReducer,
    },
    preloadedState: {
      budget: {
        budgets: [],
        loading: false,
        error: null,
        activeBudget: null,
        ...initialState,
      },
    },
  });
};

describe('Budget Component', () => {
  const mockBudgets = [
    {
      id: '1',
      name: 'Monthly Budget',
      period: 'monthly',
      categories: [
        {
          id: '1',
          name: 'Food',
          amount: 500,
          spent: 300,
        },
      ],
      totalAmount: 500,
      totalSpent: 300,
    },
  ];

  it('renders budget management page', () => {
    const store = createTestStore({ budgets: mockBudgets });
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    expect(screen.getByText('Budget Management')).toBeInTheDocument();
    expect(screen.getByText('Create Budget')).toBeInTheDocument();
  });

  it('displays budget cards when budgets exist', () => {
    const store = createTestStore({ budgets: mockBudgets });
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('$300 / $500')).toBeInTheDocument();
  });

  it('opens create budget form when clicking create button', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    fireEvent.click(screen.getByText('Create Budget'));
    expect(screen.getByText('Create Budget')).toBeInTheDocument();
  });

  it('opens edit budget form when clicking edit button', () => {
    const store = createTestStore({ budgets: mockBudgets });
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Budget')).toBeInTheDocument();
  });

  it('opens add category form when clicking add category button', () => {
    const store = createTestStore({ budgets: mockBudgets });
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('displays loading state when loading is true', () => {
    const store = createTestStore({ loading: true });
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error message when error exists', () => {
    const errorMessage = 'Failed to load budgets';
    const store = createTestStore({ error: errorMessage });
    render(
      <Provider store={store}>
        <Budget />
      </Provider>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 