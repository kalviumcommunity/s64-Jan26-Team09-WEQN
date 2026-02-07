/**
 * Global TypeScript type definitions
 */

// User roles
export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

// Token status
export type TokenStatus = 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Doctor interface
export interface Doctor {
  id: string;
  userId: string;
  department: string;
  specialization?: string;
  roomNumber?: string;
  avgConsultationMinutes: number;
  isAvailable: boolean;
  createdAt: Date;
  user?: User;
}

// Token (Queue Entry) interface
export interface Token {
  id: string;
  tokenNumber: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  status: TokenStatus;
  position?: number;
  joinedAt: Date;
  calledAt?: Date;
  completedAt?: Date;
  estimatedWaitMinutes?: number;
  patient?: User;
  doctor?: Doctor;
}

// Consultation interface
export interface Consultation {
  id: string;
  tokenId: string;
  doctorId: string;
  patientId?: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  notes?: string;
  token?: Token;
  doctor?: Doctor;
  patient?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  requestId?: string;
  timestamp?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Queue types
export interface JoinQueueRequest {
  patientName: string;
  patientPhone: string;
  doctorId: string;
  department: string;
}

export interface QueuePosition {
  tokenNumber: string;
  position: number;
  estimatedWaitMinutes: number;
  status: TokenStatus;
}

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
