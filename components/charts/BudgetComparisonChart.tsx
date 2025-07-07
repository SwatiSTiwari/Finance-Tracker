'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BudgetInsight } from '@/lib/types';

interface BudgetComparisonChartProps {
  data: BudgetInsight[];
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="category" 
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [formatCurrency(value), name === 'budgeted' ? 'Budgeted' : 'Spent']}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Bar 
            dataKey="budgeted" 
            fill="#e2e8f0"
            radius={[4, 4, 0, 0]}
            name="Budgeted"
          />
          <Bar 
            dataKey="spent" 
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Spent"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}