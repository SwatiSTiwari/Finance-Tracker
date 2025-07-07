import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BudgetInsight } from '@/lib/types';

interface BudgetInsightsProps {
  insights: BudgetInsight[];
}

export function BudgetInsights({ insights }: BudgetInsightsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{insight.category}</span>
                  {insight.isOverBudget && (
                    <Badge variant="destructive">Over Budget</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(insight.spent)} / {formatCurrency(insight.budgeted)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insight.isOverBudget ? 'Over by' : 'Remaining'}: {formatCurrency(Math.abs(insight.remaining))}
                  </p>
                </div>
              </div>
              <Progress 
                value={Math.min(insight.percentageUsed, 100)} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}