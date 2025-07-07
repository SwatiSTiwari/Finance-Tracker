# Database Setup

This project uses MongoDB with Mongoose ORM for data management.

## Environment Variables

Make sure you have the following environment variable in your `.env.local` file:

```
DATABASE_URL="mongodb+srv://swatistiwari13:3OSF0Ta9sWRmW6BP@cluster0.p5wushp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
```

## Database Structure

### Collections

1. **transactions** - Stores all financial transactions
2. **budgets** - Stores budget information by category and month

### Models

- **Transaction**: amount, date, description, category, createdAt
- **Budget**: category, monthlyBudget, currentSpent, month

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction

### Budgets
- `GET /api/budgets?month=YYYY-MM` - Get budgets for a specific month
- `POST /api/budgets` - Create or update a budget

### Analytics
- `GET /api/analytics?month=YYYY-MM` - Get analytics data

### Database Test
- `GET /api/test-db` - Test database connection

## Usage

### Using the DatabaseService

```typescript
import DatabaseService from '@/lib/database';

// Create a transaction
const transaction = await DatabaseService.createTransaction({
  amount: 50.00,
  date: '2025-01-15',
  description: 'Grocery shopping',
  category: 'Food'
});

// Get all transactions
const transactions = await DatabaseService.getAllTransactions();

// Create/update a budget
const budget = await DatabaseService.createOrUpdateBudget({
  category: 'Food',
  monthlyBudget: 500,
  month: '2025-01'
});
```

### Direct Model Usage

```typescript
import connectDB from '@/lib/mongodb';
import { Transaction, Budget } from '@/lib/models';

// Connect to database
await connectDB();

// Create a transaction
const transaction = new Transaction({
  amount: 25.99,
  date: '2025-01-15',
  description: 'Coffee',
  category: 'Food'
});
await transaction.save();

// Find transactions
const transactions = await Transaction.find({ category: 'Food' });
```

## Testing the Setup

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/api/test-db` to test the database connection
3. You should see a success response with connection details

## Notes

- The database connection is cached to prevent multiple connections in development
- All API routes handle errors gracefully
- The database service provides convenient methods for common operations
- Mongoose schemas include validation for data integrity
