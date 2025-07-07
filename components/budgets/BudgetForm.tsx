'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Budget, TransactionCategory } from '@/lib/types';
import { categories } from '@/lib/data';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'currentSpent'>) => void;
  editingBudget?: Budget | null;
  onCancel?: () => void;
}

export function BudgetForm({ onSubmit, editingBudget, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: editingBudget?.category || '' as TransactionCategory,
    monthlyBudget: editingBudget?.monthlyBudget.toString() || '',
    month: editingBudget?.month || new Date().toISOString().substring(0, 7),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.monthlyBudget || parseFloat(formData.monthlyBudget) <= 0) {
      newErrors.monthlyBudget = 'Budget must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      category: formData.category,
      monthlyBudget: parseFloat(formData.monthlyBudget),
      month: formData.month,
    });

    if (!editingBudget) {
      setFormData({
        category: '' as TransactionCategory,
        monthlyBudget: '',
        month: new Date().toISOString().substring(0, 7),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value as TransactionCategory })}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget (₹)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                className={errors.monthlyBudget ? 'border-red-500' : ''}
              />
              {errors.monthlyBudget && (
                <p className="text-red-500 text-sm">{errors.monthlyBudget}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className={errors.month ? 'border-red-500' : ''}
            />
            {errors.month && (
              <p className="text-red-500 text-sm">{errors.month}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingBudget ? 'Update Budget' : 'Set Budget'}
            </Button>
            {editingBudget && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}