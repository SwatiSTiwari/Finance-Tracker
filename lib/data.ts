import { Transaction, Budget, TransactionCategory, MonthlyExpense, CategoryExpense, BudgetInsight } from './types';

// Mock data for initial rendering
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    date: '2025-01-15',
    description: 'Grocery shopping at Big Bazaar',
    category: 'Food',
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    amount: 15000,
    date: '2025-01-01',
    description: 'Monthly rent payment',
    category: 'Rent',
    createdAt: '2025-01-01T09:00:00Z'
  },
  {
    id: '3',
    amount: 1200,
    date: '2025-01-10',
    description: 'Movie tickets and dinner',
    category: 'Entertainment',
    createdAt: '2025-01-10T19:30:00Z'
  },
  {
    id: '4',
    amount: 3500,
    date: '2025-01-05',
    description: 'Flight booking to Mumbai',
    category: 'Travel',
    createdAt: '2025-01-05T14:20:00Z'
  },
  {
    id: '5',
    amount: 850,
    date: '2025-01-12',
    description: 'Electricity bill',
    category: 'Bills',
    createdAt: '2025-01-12T16:45:00Z'
  },
  {
    id: '6',
    amount: 1800,
    date: '2025-01-08',
    description: 'Doctor consultation',
    category: 'Healthcare',
    createdAt: '2025-01-08T11:15:00Z'
  },
  {
    id: '7',
    amount: 4200,
    date: '2025-01-14',
    description: 'New laptop accessories',
    category: 'Shopping',
    createdAt: '2025-01-14T13:30:00Z'
  },
  {
    id: '8',
    amount: 2800,
    date: '2024-12-28',
    description: 'Restaurant dinner',
    category: 'Food',
    createdAt: '2024-12-28T20:15:00Z'
  },
  {
    id: '9',
    amount: 1500,
    date: '2024-12-25',
    description: 'Christmas gifts',
    category: 'Shopping',
    createdAt: '2024-12-25T15:00:00Z'
  },
  {
    id: '10',
    amount: 900,
    date: '2024-12-20',
    description: 'Gas bill',
    category: 'Bills',
    createdAt: '2024-12-20T12:00:00Z'
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food',
    monthlyBudget: 5000,
    currentSpent: 2500,
    month: '2025-01'
  },
  {
    id: '2',
    category: 'Rent',
    monthlyBudget: 15000,
    currentSpent: 15000,
    month: '2025-01'
  },
  {
    id: '3',
    category: 'Entertainment',
    monthlyBudget: 2000,
    currentSpent: 1200,
    month: '2025-01'
  },
  {
    id: '4',
    category: 'Travel',
    monthlyBudget: 3000,
    currentSpent: 3500,
    month: '2025-01'
  },
  {
    id: '5',
    category: 'Bills',
    monthlyBudget: 1500,
    currentSpent: 850,
    month: '2025-01'
  },
  {
    id: '6',
    category: 'Healthcare',
    monthlyBudget: 2000,
    currentSpent: 1800,
    month: '2025-01'
  },
  {
    id: '7',
    category: 'Shopping',
    monthlyBudget: 4000,
    currentSpent: 4200,
    month: '2025-01'
  },
  {
    id: '8',
    category: 'Other',
    monthlyBudget: 1000,
    currentSpent: 0,
    month: '2025-01'
  }
];

export const categories: TransactionCategory[] = [
  'Food',
  'Rent',
  'Travel',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Shopping',
  'Other'
];

// Data processing functions
export function getMonthlyExpenses(transactions: Transaction[]): MonthlyExpense[] {
  const monthlyData: { [key: string]: number } = {};

  transactions.forEach(transaction => {
    const month = transaction.date.substring(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + transaction.amount;
  });

  return Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getCategoryExpenses(transactions: Transaction[]): CategoryExpense[] {
  const categoryData: { [key: string]: number } = {};
  let total = 0;

  transactions.forEach(transaction => {
    categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
    total += transaction.amount;
  });

  return Object.entries(categoryData)
    .map(([category, amount]) => ({
      category: category as TransactionCategory,
      amount,
      percentage: Math.round((amount / total) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getBudgetInsights(budgets: Budget[]): BudgetInsight[] {
  return budgets.map(budget => {
    const remaining = budget.monthlyBudget - budget.currentSpent;
    const percentageUsed = Math.round((budget.currentSpent / budget.monthlyBudget) * 100);
    
    return {
      category: budget.category,
      budgeted: budget.monthlyBudget,
      spent: budget.currentSpent,
      remaining,
      isOverBudget: remaining < 0,
      percentageUsed
    };
  });
}

export function getCurrentMonthTransactions(transactions: Transaction[]): Transaction[] {
  const currentMonth = new Date().toISOString().substring(0, 7);
  return transactions.filter(transaction => transaction.date.startsWith(currentMonth));
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}