/**
 * User Type Definitions
 */

import { ROLES } from '../constants/app';

export type Role = typeof ROLES[keyof typeof ROLES];

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Patient extends User {
  role: 'PATIENT';
}

export interface DoctorUser extends User {
  role: 'DOCTOR';
  doctor?: Doctor;
}

export interface AdminUser extends User {
  role: 'ADMIN';
}
