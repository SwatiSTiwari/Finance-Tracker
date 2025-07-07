import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Budget } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    const budgets = await Budget.find({ month }).sort({ category: 1 });
    
    return NextResponse.json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { category, monthlyBudget, month } = body;
    
    // Validate required fields
    if (!category || !monthlyBudget || !month) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ category, month });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.monthlyBudget = parseFloat(monthlyBudget);
      await existingBudget.save();
      
      return NextResponse.json({
        success: true,
        data: existingBudget,
      });
    } else {
      // Create new budget
      const budget = new Budget({
        category,
        monthlyBudget: parseFloat(monthlyBudget),
        month,
      });
      
      await budget.save();
      
      return NextResponse.json({
        success: true,
        data: budget,
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update budget' },
      { status: 500 }
    );
  }
}
