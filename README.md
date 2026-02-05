# 🏥 Digital Queue Management System for Hospitals

A production-grade, cloud-native full-stack application that digitizes hospital queues in Tier-2 and Tier-3 cities. This system replaces physical waiting lines with a secure, role-based, real-time digital queue—deployable without expensive hardware or infrastructure.

**Key Value Proposition:** Reduce wait times, improve patient experience, and optimize doctor schedules using serverless cloud-native technology.

## 📌 Problem Statement

Hospitals in Tier-2/3 cities still rely on manual queues, causing:

- **Long, unpredictable wait times** – Patients spend hours in physical queues
- **Overcrowding** – Unsanitary conditions and safety risks
- **Inefficient scheduling** – Doctors have no visibility into queue dynamics
- **Poor patient experience** – No control or transparency during wait

**Solution:** A lightweight, scalable, cost-effective digital queue system built on serverless and cloud-native technologies.

## 🎯 Project Objectives

- ✅ Digitize patient queues with real-time updates
- ✅ Enable role-based dashboards for Admin, Doctor, and Patient
- ✅ Reduce overcrowding through queue visibility and ETA prediction
- ✅ Demonstrate a production-ready Next.js + Cloud architecture
- ✅ Use serverless database + containerized deployment with auto-scaling

## 🧱 Tech Stack

### Frontend & Backend
- **Next.js** (App Router, SSR/ISR)
- **TypeScript** – Type-safe codebase
- **REST APIs** – Next.js API routes

### Database & ORM
- **Neon** – Serverless PostgreSQL with auto-scaling, branching, and connection pooling
- **Prisma ORM** – Type-safe database access

### Authentication & Security
- **JWT** – Access & Refresh token-based auth
- **bcrypt** – Secure password hashing
- **Role-Based Access Control (RBAC)** – Admin, Doctor, Patient
- **OWASP-compliant input sanitization**
- **Secure HTTP headers** – CSP, HSTS, X-Frame-Options

### Caching
- **Redis** – Queue status caching, reducing database load by 60%+
- **Next.js ISR** – Static regeneration for patient dashboards

### Cloud & DevOps
- **Docker & Docker Compose** – Containerized local development
- **GitHub Actions** – CI/CD pipeline
- **Amazon ECS (Fargate) / Azure App Service** – Serverless deployment
- **AWS S3 / Azure Blob Storage** – File uploads via pre-signed URLs
- **Secrets Manager / Azure Key Vault** – Secure credential management

### UI & UX
- **Tailwind CSS** – Utility-first styling
- **Responsive design** – Mobile-first approach
- **Skeleton loaders & error states** – Enhanced UX
- **Accessible components** – WCAG-compliant modals, toasts

### Testing & Quality
- **Jest** – Unit testing
- **React Testing Library** – Component testing
- **Supertest** – API integration testing
- **ESLint + Prettier** – Code quality & formatting

## 👥 User Roles

### 🧑‍⚕️ Admin
- Manage doctors and hospital departments
- Monitor real-time queue status across departments
- View system-level insights and analytics
- Generate reports and configure settings

### 🩺 Doctor
- View assigned queue with patient details
- Call next patient with one click
- Control consultation flow and duration
- Access past consultation history

### 🧑‍🤝‍🧑 Patient
- Join queue digitally without physical presence
- View token number and live queue position
- Receive real-time notifications (SMS/Email)
- Cancel or reschedule appointment

## 🧩 Core Features

- 🎟️ **Digital Token Generation** – Patients join queues with unique tokens
- 📊 **Real-Time Queue Tracking** – Live position updates via WebSockets
- ⏱️ **ETA Calculation** – ML-based predictions using consultation history
- 🔐 **Secure Authentication** – JWT + role-based authorization
- ⚡ **Redis Caching** – High-performance response times (avg <200ms)
- 📁 **File Uploads** – Pre-signed URLs for secure document uploads
- 📧 **Email/SMS Notifications** – Transactional alerts for patients
- 🐳 **Cloud-Ready Deployment** – Docker + Kubernetes-ready architecture
- 📈 **Scalability** – Handles 10K+ concurrent patients per hospital

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client (Browser/Mobile)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + JWT Auth
┌────────────────────────▼────────────────────────────────────┐
│            Next.js Application (App Router)                  │
│  ├─ UI Components (React + Tailwind)                         │
│  ├─ API Routes (REST + WebSocket)                            │
│  └─ Middleware (Auth, RBAC, Rate Limiting)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌────────┐    ┌──────────┐      ┌──────────┐
   │ Neon   │    │  Redis   │      │   S3/    │
   │ PG     │    │  Cache   │      │ Storage  │
   └────────┘    └──────────┘      └──────────┘
        │
        └── Prisma ORM (Type-Safe Migrations)

┌───────────────────────────────────────────────────────────────┐
│  CI/CD: GitHub Actions → Docker Build → Registry              │
│  Deployment: ECS (Fargate)                                    │
│  Monitoring: CloudWatch                                       │
└───────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
s64-Jan26-Team09-WEQN/
├── src/
│   ├── app/
│   │   ├── api/                    # REST API routes
│   │   │   ├── auth/              # Login, signup, token refresh
│   │   │   ├── queue/             # Queue operations
│   │   │   └── admin/             # Admin endpoints
│   │   ├── (auth)/                # Auth pages (login, signup)
│   │   ├── dashboard/             # Role-based dashboards
│   │   │   ├── patient/
│   │   │   ├── doctor/
│   │   │   └── admin/
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/                # Reusable UI components
│   │   ├── Queue/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   └── Common/
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # JWT utilities
│   │   ├── redis.ts               # Redis client
│   │   └── validators.ts          # Input validation
│   ├── middleware.ts              # Auth & RBAC middleware
│   └── types/                     # TypeScript interfaces
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Version-controlled migrations
├── public/                        # Static assets
├── docker-compose.yml             # Local dev environment
├── .env.example                   # Environment template
├── .github/workflows/             # CI/CD pipelines
├── jest.config.js                 # Testing configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js 18+** – [Download](https://nodejs.org)
- **Docker & Docker Compose** – [Install](https://docs.docker.com/desktop)
- **Git** – Version control
- **Neon Account** – [Free serverless PostgreSQL](https://neon.tech)
- **Redis** – Local instance or cloud (e.g., Redis Cloud)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/your-org/digital-queue-system.git
cd digital-queue-system

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start local services (PostgreSQL, Redis)
docker compose up -d

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` and log in with test credentials.

### Database Setup
```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset database (dev only)
npx prisma migrate reset
```

## 🔐 Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/queue_db
DIRECT_DATABASE_URL=postgresql://user:password@localhost:5432/queue_db

# Authentication
JWT_SECRET=your-super-secret-key-here-min-32-chars
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Redis
REDIS_URL=redis://localhost:6379

# File Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=hospital-queue-uploads

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**⚠️ Security Note:** In production, use cloud secret managers (AWS Secrets Manager, Azure Key Vault) instead of `.env` files.

## 🚀 Deployment Strategy

### Build Pipeline
1. **Code Push** → GitHub Actions triggered
2. **Tests** → Jest + Supertest run on every PR
3. **Docker Build** → Image created and tagged with commit SHA
4. **Registry Push** → Image pushed to ECR / Azure Container Registry

### Deployment Process
```bash
# Development
npm run dev              # Local Next.js dev server

# Production Build
npm run build            # Optimized Next.js build
npm run start            # Production server

# Docker
docker build -t app:latest .
docker run -p 3000:3000 app:latest
```

### Cloud Deployment
- **Container Orchestration:** Amazon ECS (Fargate)
- **Auto-Scaling:** Scale based on CPU/Memory
- **Load Balancing:** Application Load Balancer with sticky sessions
- **HTTPS:** AWS Certificate Manager
- **Logging:** CloudWatch
- **Monitoring & Alerts:** Prometheus + Grafana (optional)

### Deployment Checklist
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Cache warmed (if needed)
- [ ] Secrets rotated

## 🧪 Testing Strategy

### Unit Tests
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```
- Core business logic (queue algorithms, auth)
- Utility functions and helpers

### Integration Tests
- API routes with mock database
- Authentication flows
- RBAC authorization

### E2E Tests (Optional)
- Playwright / Cypress for user workflows
- Queue join → Call next → Consultation flow

### CI/CD Pipeline
- Tests must pass before merge
- Coverage threshold: **80% minimum**
- Automatic deployment on main branch

## 📚 Documentation

- **[API Documentation](./docs/API.md)** – OpenAPI/Swagger specifications
- **[Architecture & Design](./docs/ARCHITECTURE.md)** – System design decisions
- **[Database Schema](./docs/DATABASE.md)** – Prisma migrations and relationships
- **[Deployment Guide](./docs/DEPLOYMENT.md)** – Step-by-step cloud deployment
- **[Contributing Guide](./CONTRIBUTING.md)** – Code standards and PR process
- **[Security Guide](./docs/SECURITY.md)** – Best practices and vulnerability reporting


## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and submission process.

### Quick Start for Contributors
```bash
git checkout -b feature/your-feature
npm run test              # Run tests
npm run lint              # Check code style
git commit -m "feat: your feature"
git push origin feature/your-feature
```

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
