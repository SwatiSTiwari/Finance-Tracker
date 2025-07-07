import connectDB from './mongodb';
import { Transaction, Budget } from './models';
import { TransactionCategory } from './types';

export class DatabaseService {
  // Transaction operations
  static async getAllTransactions(limit = 50) {
    await connectDB();
    return await Transaction.find({}).sort({ createdAt: -1 }).limit(limit);
  }

  static async createTransaction(data: {
    amount: number;
    date: string;
    description: string;
    category: TransactionCategory;
  }) {
    await connectDB();
    const transaction = new Transaction(data);
    return await transaction.save();
  }

  static async getTransactionsByCategory(category: TransactionCategory) {
    await connectDB();
    return await Transaction.find({ category }).sort({ createdAt: -1 });
  }

  static async getTransactionsByMonth(month: string) {
    await connectDB();
    return await Transaction.find({
      date: { $regex: `^${month}` }
    }).sort({ createdAt: -1 });
  }

  // Budget operations
  static async getAllBudgets(month?: string) {
    await connectDB();
    const currentMonth = month || new Date().toISOString().slice(0, 7);
    return await Budget.find({ month: currentMonth });
  }

  static async createOrUpdateBudget(data: {
    category: TransactionCategory;
    monthlyBudget: number;
    month: string;
  }) {
    await connectDB();
    
    const existingBudget = await Budget.findOne({
      category: data.category,
      month: data.month
    });

    if (existingBudget) {
      existingBudget.monthlyBudget = data.monthlyBudget;
      return await existingBudget.save();
    } else {
      const budget = new Budget(data);
      return await budget.save();
    }
  }

  static async updateBudgetSpent(category: TransactionCategory, month: string, spent: number) {
    await connectDB();
    
    const budget = await Budget.findOne({ category, month });
    if (budget) {
      budget.currentSpent = spent;
      return await budget.save();
    }
    return null;
  }

  // Analytics operations
  static async getMonthlyExpenses() {
    await connectDB();
    
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] }, // Group by YYYY-MM
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          month: '$_id',
          amount: '$totalAmount',
          _id: 0
        }
      }
    ]);

    return result;
  }

  static async getCategoryExpenses(month?: string) {
    await connectDB();
    
    const matchStage = month 
      ? { $match: { date: { $regex: `^${month}` } } }
      : { $match: {} };

    const result = await Transaction.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          amount: '$totalAmount',
          _id: 0
        }
      }
    ]);

    // Calculate percentages
    const totalExpenses = result.reduce((sum, item) => sum + item.amount, 0);
    
    return result.map(item => ({
      ...item,
      percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
    }));
  }
}

export default DatabaseService;
