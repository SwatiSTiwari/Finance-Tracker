export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: TransactionCategory;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  monthlyBudget: number;
  currentSpent: number;
  month: string; // YYYY-MM format
}

export type TransactionCategory = 
  | 'Food'
  | 'Rent'
  | 'Travel'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'Shopping'
  | 'Other';

export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

export interface BudgetInsight {
  category: TransactionCategory;
  budgeted: number;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
  percentageUsed: number;
}