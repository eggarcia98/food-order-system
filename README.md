# Food Order Registration System

A modern food ordering system built with Next.js, TypeScript, Prisma, and PostgreSQL. This application allows customers to register orders, manage dishes, and track order details.

## 🚀 Demo

🔗 **[Live Demo](https://food-order-system.pages.dev/)** 

Try out the application with the following features:
- Browse available dishes by nationality
- Create and manage customer orders
- Add sides and extras to orders
- Track order history and status

## ✨ Features

- 🍽️ **Menu Management** - Browse dishes categorized by nationality
- 📝 **Order Creation** - Easy-to-use interface for creating new orders
- 👥 **Customer Management** - Track customer information and order history
- 🎯 **Order Tracking** - Monitor order status and dispatch orders
- 🔐 **Authentication** - Secure login and signup functionality
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase, Neon, Railway)
- pnpm (or npm/yarn)

## 📦 Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd food-order-system
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/food_orders?schema=public"
```

Replace with your PostgreSQL connection string:
- **Local**: `postgresql://username:password@localhost:5432/database_name`
- **Supabase**: Get from Project Settings → Database → Connection String (URI)
- **Neon**: Copy from your Neon dashboard
- **Railway**: Copy from your Railway PostgreSQL plugin

### 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Seed the database with sample data
# npx prisma db seed

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signUp` - User registration

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Retrieve all orders
- `POST /api/orders/[orderId]/dispatch` - Dispatch an order

### Resources
- `GET /api/customers` - Get all customers
- `GET /api/dishes` - Get all dishes
- `GET /api/nationalities` - Get all nationalities
- `GET /api/sides` - Get all sides

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- All contributors who help improve this project