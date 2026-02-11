# Assignment 2.38: Cloud Database Configuration (RDS / Azure SQL / Managed PostgreSQL)

This document provides technical guidance and the implementation strategy for securely connecting the Digital Queue Management System to a managed cloud PostgreSQL database.

## 1. Environment Configuration
Securely connect to cloud-managed Postgres using the following environment variables (configured in `.env.local` or cloud secrets):

- **DATABASE_URL**: The primary connection string. If using a connection pooler like PgBouncer or Prisma Accelerate, use the pooled URL here.
- **DIRECT_DATABASE_URL**: The direct connection string to the database. Essential for Prisma migrations to bypass connection poolers.
- **SSL Requirement**: Both URLs **MUST** include `?sslmode=require` to ensure all data in transit is encrypted.
- **Security**: Never hardcode credentials. Use cloud provider secret managers (AWS Secrets Manager, Azure Key Vault).

## 2. Prisma Configuration
The [schema.prisma](file:///Users/sky_walker/Documents/Kalvium-projects/s64-Jan26-Team09-WEQN/prisma/schema.prisma) is configured to support both direct and pooled connections:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

## 3. Connection Pooling Strategy
For serverless environments (Next.js/Vercel) or high-traffic managed instances:
- **Prisma Accelerate**: Recommended for serverless to manage connection limits and provide global caching.
- **PgBouncer**: If using a traditional pooler, ensure `DATABASE_URL` uses the pooler port (default 6543) and `DIRECT_DATABASE_URL` uses the standard Postgres port (5432).
- **Client Singleton**: The implementation in [prisma.ts](file:///Users/sky_walker/Documents/Kalvium-projects/s64-Jan26-Team09-WEQN/src/lib/db/prisma.ts) prevents "too many clients" errors during development hot-reloading.

## 4. Production Migration Strategy
To ensure production safety and prevent data loss:

### ❌ DO NOT USE: `npx prisma migrate dev` in Production
- `migrate dev` is for development only.
- It may attempt to reset the database if it detects schema drift, which causes **permanent data loss**.

### ✅ ALWAYS USE: `npx prisma migrate deploy` in Production
- This command applies pending migrations from the `prisma/migrations` folder.
- It **never** resets the database or deletes data.
- It is idempotent and safe to run as part of a CI/CD pipeline.

## 5. Security Checklist
- [ ] **Enforce SSL**: `sslmode=require` must be in all connection strings.
- [ ] **Secrets Management**: Use cloud provider secrets instead of committing `.env` files.
- [ ] **Network Isolation**: Configure Security Groups (AWS) or Firewalls (Azure) to only allow traffic from the application's IP range.
- [ ] **Least Privilege**: Use a database user with only the necessary permissions.

---
*Note: This configuration is optimized for Managed PostgreSQL services like AWS RDS, Azure Database for PostgreSQL, and Neon.tech.*
