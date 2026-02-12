# Docker Setup

## Quick Start

1. **Start MongoDB**:

   ```bash
   docker-compose up -d
   ```

2. **Generate Prisma Client**:

   ```bash
   npm run db:generate
   ```

3. **Push schema to database**:

   ```bash
   npm run db:push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Docker Commands

- Start containers: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs -f mongodb`
- Restart: `docker-compose restart`

## MongoDB Connection

- **Host**: localhost
- **Port**: 27017
- **Username**: admin
- **Password**: password
- **Database**: scorecards
- **Connection String**: `mongodb://admin:password@localhost:27017/scorecards?authSource=admin`

## Prisma Commands

- Generate client: `npm run db:generate`
- Push schema: `npm run db:push`
- Open Prisma Studio: `npm run db:studio`

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```
