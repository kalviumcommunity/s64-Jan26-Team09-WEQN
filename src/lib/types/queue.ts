/**
 * Queue Type Definitions
 */

import { TOKEN_STATUS } from '../constants/app';
import { Doctor, User } from './user';

export type TokenStatus = typeof TOKEN_STATUS[keyof typeof TOKEN_STATUS];

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

export interface QueuePosition {
  tokenId: string;
  tokenNumber: string;
  position: number;
  estimatedWaitMinutes: number;
  status: TokenStatus;
}

export interface QueueJoinRequest {
  patientName: string;
  patientPhone: string;
  doctorId: string;
  department: string;
}

export interface QueueJoinResponse {
  tokenId: string;
  tokenNumber: string;
  position: number;
  estimatedWaitMinutes: number;
  doctorName: string;
  department: string;
}

export interface Consultation {
  id: string;
  tokenId: string;
  doctorId: string;
  patientId?: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  notes?: string;
}
