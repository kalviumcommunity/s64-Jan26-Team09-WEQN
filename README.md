🏥 Digital Queue Management System for Hospitals

A production-grade, cloud-native full-stack application that digitizes hospital queues in Tier-2 and Tier-3 cities using modern web, cloud, and DevOps practices.

This system replaces physical waiting lines with a secure, role-based, real-time digital queue, deployable without expensive hardware or infrastructure.

📌 Problem Statement

Hospitals in Tier-2/3 cities still rely on manual queues, resulting in:

Long and unpredictable waiting times

Overcrowding in hospital premises

Inefficient doctor scheduling

Poor patient experience

This project provides a lightweight, scalable, and cost-effective digital queue system built using serverless and cloud-native technologies.

🎯 Project Objectives

Digitize patient queues with real-time updates

Enable role-based dashboards for Admin, Doctor, and Patient

Reduce overcrowding using queue visibility and ETA prediction

Demonstrate a production-ready Next.js + Cloud architecture

Use serverless database + containerized deployment

🧱 Tech Stack
Frontend & Backend

Next.js (App Router)

TypeScript

REST APIs using Next.js API routes

Database & ORM

Neon (Serverless PostgreSQL)

Prisma ORM

Neon provides auto-scaling, branching, and serverless Postgres optimized for modern web applications.

Authentication & Security

JWT (Access & Refresh Tokens)

bcrypt for password hashing

Role-Based Access Control (RBAC)

OWASP-compliant input sanitization

Secure HTTP headers (CSP, HSTS, CORS)

Caching

Redis

Cache queue status

Reduce database reads

Improve response latency

Cloud & DevOps

Docker & Docker Compose

GitHub Actions (CI/CD)

Amazon ECS (Fargate) / Azure App Service

AWS S3 / Azure Blob Storage (file uploads)

Secrets Manager / Azure Key Vault

UI & UX

Tailwind CSS

Responsive design (mobile-first)

Skeleton loaders & error states

Accessible modals, toasts, and feedback UI

Testing & Quality

Jest

React Testing Library

Supertest

ESLint + Prettier (strict rules enforced)

👥 User Roles
🧑‍⚕️ Admin

Manage doctors and hospital data

Monitor queues across departments

View system-level insights

🩺 Doctor

View assigned queue

Call next patient

Control consultation flow

🧑‍🤝‍🧑 Patient

Join queue digitally

View token number and live status

Receive notifications

🧩 Core Features

Digital token generation

Real-time queue tracking

ETA calculation using average consultation time

Secure authentication and authorization

Redis-based caching for high-traffic endpoints

File uploads via pre-signed URLs

Transactional email notifications

Fully containerized cloud deployment

🏗️ System Architecture (High Level)
Client (Browser)
   ↓
Next.js App (UI + API Routes)
   ↓
Neon Serverless PostgreSQL ← Prisma ORM
   ↓
Redis (Caching Layer)
   ↓
S3 / Blob Storage (Files)


The application is containerized using Docker and deployed via cloud-native CI/CD pipelines.

📁 Project Structure
src/
 ├── app/                # App Router pages & layouts
 │   ├── api/            # REST API routes
 │   ├── (auth)/         # Login / Signup
 │   └── dashboard/      # Role-based dashboards
 ├── components/         # Reusable UI components
 ├── lib/
 │   ├── prisma.ts       # Prisma client
 │   ├── auth.ts         # JWT utilities
 │   ├── redis.ts        # Redis client
 ├── middleware.ts       # Auth & RBAC middleware

🛠️ Local Development Setup
Prerequisites

Node.js 18+

Docker & Docker Compose

Neon account

Redis (local or cloud)

Setup Steps
git clone https://github.com/your-username/digital-queue-system.git
cd digital-queue-system
cp .env.example .env.local
docker compose up -d
npx prisma migrate dev
npm run dev

🔐 Environment Variables
DATABASE_URL=postgresql://<neon-connection-string>
JWT_SECRET=
REDIS_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=


In production, environment variables are securely managed using cloud secret managers.

🚀 Deployment Strategy

Docker images built via GitHub Actions

Images pushed to container registry

Deployed to ECS (Fargate) / Azure App Service

HTTPS enforced via managed SSL

Logging & monitoring via CloudWatch / Azure Monitor

🧪 Testing Strategy

Unit Tests: Core business logic

Integration Tests: API routes

Frontend Tests: UI behavior & forms

CI blocks deployment on test failures

📚 Documentation

API documentation via Swagger / Postman

Architecture & design docs in /docs

Database schema versioned using Prisma migrations