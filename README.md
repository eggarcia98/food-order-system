# Food Order Registration System - Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase, Neon, Railway)

## Installation Steps

### 1. Create Next.js Project
```bash
npx create-next-app@latest food-order-system --typescript --tailwind --app --no-src-dir
cd food-order-system
```

### 2. Install Dependencies
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 3. Setup Project Structure
Create the following files with the provided code:

- `app/page.tsx` - Main order registration page
- `app/api/orders/route.ts` - API endpoints
- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client singleton

### 4. Configure Database

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/food_orders?schema=public"
```

Replace with your PostgreSQL connection string:
- **Local**: `postgresql://username:password@localhost:5432/database_name`
- **Supabase**: Get from Project Settings → Database → Connection String (URI)
- **Neon**: Copy from your Neon dashboard
- **Railway**: Copy from your Railway PostgreSQL plugin

### 5. Initialize Prisma and Create Database

```bash
# Initialize Prisma (if not already done)
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 6. Update TypeScript Config

Add to `tsconfig.json` if needed:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## Database Schema

The system creates two tables:

### Orders Table
- `id` - Unique identifier
- `phone_number` - Customer phone
- `name` - Customer name
- `comments` - Order comments
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Dishes Table
- `id` - Unique identifier
- `dish` - Dish name
- `quantity` - Number of items
- `extras` - Special requests
- `order_id` - Foreign key to orders

## API Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Retrieve all orders

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Before deploying:
```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

## Troubleshooting

**Error: Can't reach database server**
- Check your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

**Error: PrismaClient is not configured**
- Run `npx prisma generate`
- Restart your dev server

**Error: relation "orders" does not exist**
- Run `npx prisma db push` or `npx prisma migrate dev`

## Optional Enhancements

Consider adding:
- Form validation with Zod
- Toast notifications with Sonner
- Order list/history page
- Search and filter functionality
- Export orders to CSV
- Authentication with NextAuth.js