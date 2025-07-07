import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food',
      'Rent',
      'Travel',
      'Entertainment',
      'Bills',
      'Healthcare',
      'Shopping',
      'Other'
    ],
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'Food',
      'Rent',
      'Travel',
      'Entertainment',
      'Bills',
      'Healthcare',
      'Shopping',
      'Other'
    ],
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
  currentSpent: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    required: true, // YYYY-MM format
  },
});

// Create compound index for category and month to prevent duplicates
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
