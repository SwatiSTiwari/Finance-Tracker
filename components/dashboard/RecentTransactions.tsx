import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/lib/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food': 'bg-blue-100 text-blue-800',
      'Rent': 'bg-green-100 text-green-800',
      'Travel': 'bg-amber-100 text-amber-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Bills': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-cyan-100 text-cyan-800',
      'Shopping': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.description}</p>
                  <Badge 
                    variant="secondary" 
                    className={getCategoryColor(transaction.category)}
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(transaction.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}