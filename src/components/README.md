# Components Directory

This directory contains all reusable UI components organized by feature and type.

## Structure

```
components/
├── auth/           # Authentication-related components
├── queue/          # Queue management components
├── dashboard/      # Dashboard components
├── common/         # Common/shared UI components
└── layout/         # Layout components (Header, Footer, Sidebar)
```

## Component Guidelines

### 1. Component Structure

Each component should follow this structure:

```typescript
// ComponentName.tsx
import { ComponentProps } from './ComponentName.types';
import styles from './ComponentName.module.css'; // Optional

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### 2. Naming Conventions

- **Files:** PascalCase (e.g., `QueueCard.tsx`)
- **Components:** PascalCase (e.g., `QueueCard`)
- **Props interfaces:** `ComponentNameProps`
- **CSS Modules:** `ComponentName.module.css`

### 3. Component Types

#### Presentational Components
- Pure UI components
- No business logic
- Receive data via props
- Example: `Button`, `Card`, `Modal`

#### Container Components
- Handle business logic
- Fetch data
- Pass data to presentational components
- Example: `QueueContainer`, `DashboardContainer`

### 4. Best Practices

- **Single Responsibility:** Each component should do one thing well
- **Composition:** Build complex UIs from simple components
- **Props Validation:** Use TypeScript interfaces for all props
- **Accessibility:** Include ARIA labels and keyboard navigation
- **Performance:** Use React.memo() for expensive components
- **Testing:** Write tests for all components

### 5. Example Component

```typescript
// components/common/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant}`}
      aria-label={label}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}
```

### 6. Component Organization

- Group related components in feature folders
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use barrel exports (index.ts) for cleaner imports

### 7. Styling

- Use Tailwind CSS utility classes
- CSS Modules for component-specific styles
- Avoid inline styles unless dynamic
- Follow mobile-first approach

### 8. State Management

- Use React hooks (useState, useEffect) for local state
- Context API for shared state within feature
- Consider Zustand/Redux for global state (if needed)

## Import Examples

```typescript
// Named import
import { Button } from '@/components/common/Button';

// Default import
import Button from '@/components/common/Button';

// Barrel import
import { Button, Card, Modal } from '@/components/common';
```
