'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetInsights } from '@/components/dashboard/BudgetInsights';
import { MonthlyExpensesChart } from '@/components/charts/MonthlyExpensesChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { BudgetComparisonChart } from '@/components/charts/BudgetComparisonChart';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { 
  mockTransactions, 
  mockBudgets, 
  getMonthlyExpenses, 
  getCategoryExpenses, 
  getBudgetInsights,
  getCurrentMonthTransactions,
  getTotalExpenses 
} from '@/lib/data';
import { Transaction, Budget } from '@/lib/types';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Calculate stats
  const totalExpenses = getTotalExpenses(transactions);
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const currentMonthExpenses = getTotalExpenses(currentMonthTransactions);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.monthlyBudget, 0);
  const budgetInsights = getBudgetInsights(budgets);
  const overBudgetCount = budgetInsights.filter(insight => insight.isOverBudget).length;

  // Chart data
  const monthlyExpensesData = getMonthlyExpenses(transactions);
  const categoryExpensesData = getCategoryExpenses(transactions);

  // Update budget current spent when transactions change
  useEffect(() => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    
    const updatedBudgets = budgets.map(budget => {
      const categorySpent = monthTransactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        currentSpent: categorySpent
      };
    });

    setBudgets(updatedBudgets);
  }, [transactions]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData,
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!editingTransaction) return;
    
    const updatedTransaction: Transaction = {
      ...editingTransaction,
      ...transactionData,
    };
    
    setTransactions(transactions.map(t => 
      t.id === editingTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddBudget = (budgetData: Omit<Budget, 'id' | 'currentSpent'>) => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      ...budgetData,
      currentSpent: 0,
    };
    setBudgets([...budgets, newBudget]);
  };

  const handleEditBudget = (budgetData: Omit<Budget, 'id' | 'currentSpent'>) => {
    if (!editingBudget) return;
    
    const updatedBudget: Budget = {
      ...editingBudget,
      ...budgetData,
    };
    
    setBudgets(budgets.map(b => 
      b.id === editingBudget.id ? updatedBudget : b
    ));
    setEditingBudget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Finance Visualizer</h1>
          <p className="text-gray-600">Track your expenses, manage budgets, and gain financial insights</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards
              totalExpenses={totalExpenses}
              currentMonthExpenses={currentMonthExpenses}
              overBudgetCount={overBudgetCount}
              totalBudget={totalBudget}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expenses Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyExpensesChart data={monthlyExpensesData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart data={categoryExpensesData} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <RecentTransactions transactions={transactions} />
              <BudgetInsights insights={budgetInsights} />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionForm
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              editingTransaction={editingTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
            <TransactionList
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetForm
              onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
              editingBudget={editingBudget}
              onCancel={() => setEditingBudget(null)}
            />
            <BudgetInsights insights={budgetInsights} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Actual Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetComparisonChart data={budgetInsights} />
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MonthlyExpensesChart data={monthlyExpensesData} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryPieChart data={categoryExpensesData} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}