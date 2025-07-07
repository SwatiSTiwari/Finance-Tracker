import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Transaction } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    
    const transactions = await Transaction.find({}).sort({ createdAt: -1 }).limit(10);
    
    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount, date, description, category } = body;
    
    // Validate required fields
    if (!amount || !date || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const transaction = new Transaction({
      amount: parseFloat(amount),
      date,
      description,
      category,
    });
    
    await transaction.save();
    
    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
