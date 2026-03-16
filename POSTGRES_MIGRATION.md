# PostgreSQL Migration Guide

This project has been migrated from MongoDB to PostgreSQL with a JSONB document store.

## What Changed

### Database Structure
- **MongoDB collections** → **PostgreSQL documents table with JSONB**
- **ObjectId** → **UUID** (automatically generated)
- Uses a single `documents` table with:
  - `id` (UUID) - primary key
  - `collection` (VARCHAR) - collection name
  - `data` (JSONB) - the actual document data
  - `created_at`, `updated_at` - timestamps

### Files Updated
- `src/app/lib/db.ts` - Rewritten to use PostgreSQL SQL queries
- `src/app/lib/ConnectionPool.ts` - Now uses `pg` Pool instead of MongoDB
- `src/app/api/crud/route.ts` - Removed MongoDB imports
- `package.json` - Added `pg` and `uuid` dependencies

### Development Scripts
- `npm run dev` - Start Next.js dev server (assumes PostgreSQL is running)
- `npm run dev:pg` - Start PostgreSQL container, then Next.js

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Set up PostgreSQL Database

#### Option A: Using Docker/Podman
```bash
podman run -d \
  --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ordering \
  -p 5432:5432 \
  postgres:16-alpine
```

#### Option B: Using existing PostgreSQL
Make sure PostgreSQL is running and create the database:
```bash
psql -U postgres -c "CREATE DATABASE ordering;"
```

### 3. Initialize Database Schema
```bash
# Using the SQL file (adjust user/password as needed)
psql -U postgres -d ordering -f scripts/init-postgres.sql

# Or manually create the table:
psql -U postgres -d ordering -c "CREATE TABLE documents (
  id UUID PRIMARY KEY,
  collection VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id, collection)
);"
```

### 4. Configure Environment Variables

Create `.env.local`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost/ordering
```

Or use a different connection string format:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### 5. Run Development Server
```bash
npm run dev
```

## Key Differences from MongoDB

### IDs
- **Before**: `new ObjectId()` created MongoDB ObjectIds
- **After**: UUIDs are automatically generated (use `data.id` or `data.id`)
- The `db.ts` functions accept string IDs

### Query Examples

#### Save a Document
```typescript
await db.save({
  id: "uuid-string", // optional, auto-generates if not provided
  name: "John"
}, "customers");
```

#### Get a Document
```typescript
const doc = await db.get("uuid-string", "customers");
```

#### Get All Documents in Collection
```typescript
const docs = await db.get(null, "customers");
```

#### Delete a Document
```typescript
await db.del("uuid-string", "customers");
```

## Notes

- The JSONB column allows flexible document structure like MongoDB
- Indexes on `collection`, `created_at`, and `data` for performance
- All existing validation with jsonschema is preserved
- The connection pool manages up to 20 concurrent connections

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running on localhost:5432
- Check `DATABASE_URL` in `.env.local`
- Verify database and user exist

### Table Does Not Exist
```bash
psql -U postgres -d ordering -f scripts/init-postgres.sql
```

### UUID Parsing Errors
- Make sure all IDs are valid UUID strings
- The system auto-generates UUIDs if none provided

## Performance Tuning

For large datasets, consider:
- Adding partial indexes: `CREATE INDEX ON documents(collection) WHERE collection = 'orders';`
- Using JSONB operators for querying: `WHERE data @> '{"status": "active"}'::jsonb`
- Connection pool settings in `src/app/lib/ConnectionPool.ts`
