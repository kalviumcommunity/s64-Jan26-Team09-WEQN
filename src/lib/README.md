# Lib Directory

This directory contains utility functions, helpers, configurations, and business logic.

## Structure

```
lib/
├── auth/           # Authentication utilities
├── api/            # API client and helpers
├── db/             # Database utilities (Prisma client)
├── utils/          # General utility functions
├── validators/     # Input validation schemas (Zod)
├── constants/      # Application constants
├── hooks/          # Custom React hooks
└── types/          # Shared TypeScript types
```

## Guidelines

### 1. Utility Functions

Keep utility functions pure and testable:

```typescript
// lib/utils/formatters.ts
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '+$1 $2-$3');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}
```

### 2. API Client

Centralize API calls:

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

### 3. Database Client

Singleton Prisma client:

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. Validators

Use Zod for runtime validation:

```typescript
// lib/validators/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### 5. Custom Hooks

Reusable React hooks:

```typescript
// lib/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from '@/lib/types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from API or localStorage
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
```

### 6. Constants

Application-wide constants:

```typescript
// lib/constants/app.ts
export const APP_NAME = 'Digital Queue Management System';
export const APP_VERSION = '1.0.0';

export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
} as const;

export const TOKEN_STATUS = {
  WAITING: 'WAITING',
  CALLED: 'CALLED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  QUEUE: {
    JOIN: '/api/queue/join',
    LEAVE: '/api/queue/leave',
    POSITION: '/api/queue/position',
  },
} as const;
```

### 7. Types

Shared TypeScript types:

```typescript
// lib/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  createdAt: Date;
}

export interface Doctor extends User {
  department: string;
  specialization?: string;
  roomNumber?: string;
  isAvailable: boolean;
}
```

## Best Practices

### 1. Pure Functions
- No side effects
- Same input = same output
- Easy to test

### 2. Error Handling
```typescript
export async function safeApiCall<T>(
  fn: () => Promise<T>
): Promise<{ data?: T; error?: Error }> {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    return { error: error as Error };
  }
}
```

### 3. Type Safety
- Use TypeScript for all files
- Avoid `any` type
- Use generics for reusable functions

### 4. Documentation
- Add JSDoc comments for complex functions
- Include usage examples
- Document edge cases

### 5. Testing
- Write unit tests for utilities
- Mock external dependencies
- Test edge cases

## Import Examples

```typescript
// Import utilities
import { formatPhoneNumber } from '@/lib/utils/formatters';

// Import API client
import { apiClient } from '@/lib/api/client';

// Import hooks
import { useAuth } from '@/lib/hooks/useAuth';

// Import validators
import { loginSchema } from '@/lib/validators/auth';

// Import constants
import { ROLES } from '@/lib/constants/app';
```

## File Organization

- One utility per file (unless closely related)
- Group related utilities in folders
- Use barrel exports (index.ts) for cleaner imports
- Keep files small and focused
