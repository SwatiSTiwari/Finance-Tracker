import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    const [monthlyExpenses, categoryExpenses] = await Promise.all([
      DatabaseService.getMonthlyExpenses(),
      DatabaseService.getCategoryExpenses(month || undefined)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        monthlyExpenses,
        categoryExpenses
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
