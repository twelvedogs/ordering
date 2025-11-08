This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

This project uses PostgreSQL as the database. Make sure you have PostgreSQL installed and running on your system.

### Database Setup

1. Create a PostgreSQL database named `ordering`:

```bash
createdb ordering
```

2. Copy the example environment file and configure your database connection:

```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` with your PostgreSQL credentials:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ordering
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

### Quick Start Commands

After setting up the database and environment variables:

```bash
# Install dependencies
pnpm install

# Test PostgreSQL connection
node scripts/test-connection.js

# Initialize database schema
node scripts/init-db.js

# Seed with sample data
node scripts/seed-modems.js

# Start development server
pnpm dev
```



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
