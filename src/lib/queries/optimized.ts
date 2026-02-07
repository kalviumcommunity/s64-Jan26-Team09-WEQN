import { prisma } from '../db/prisma';
import { TokenStatus } from '@prisma/client';

/**
 * Optimization 1: Select Only Needed Fields
 * Avoid fetching all fields when you only need a few
 */

// ❌ Inefficient - fetches all fields including relations
export async function getTokensInefficient(doctorId: string) {
    return await prisma.token.findMany({
        where: { doctorId },
        include: {
            patient: true,
            doctor: true,
            consultation: true,
        },
    });
}

// ✅ Optimized - select only required fields
export async function getTokensOptimized(doctorId: string) {
    return await prisma.token.findMany({
        where: { doctorId, status: TokenStatus.WAITING },
        select: {
            id: true,
            tokenNumber: true,
            patientName: true,
            status: true,
            position: true,
            estimatedWaitMinutes: true,
        },
        orderBy: { joinedAt: 'asc' },
    });
}

/**
 * Optimization 2: Pagination
 * Avoid fetching all records at once
 */

// ❌ Inefficient - loads all consultations
export async function getAllConsultations() {
    return await prisma.consultation.findMany();
}

// ✅ Optimized - paginated results
export async function getConsultationsPaginated(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [consultations, total] = await prisma.$transaction([
        prisma.consultation.findMany({
            skip,
            take: pageSize,
            orderBy: { startTime: 'desc' },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                durationMinutes: true,
                doctor: {
                    select: {
                        user: {
                            select: { name: true },
                        },
                        department: true,
                    },
                },
                patient: {
                    select: { name: true },
                },
            },
        }),
        prisma.consultation.count(),
    ]);

    return {
        data: consultations,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}

/**
 * Optimization 3: Batch Operations
 * Create multiple records in a single query
 */

// ✅ Optimized - batch create
export async function createMultipleUsers(users: Array<{ name: string; email: string; passwordHash: string }>) {
    return await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });
}

/**
 * Optimization 4: Prevent N+1 Queries
 * Use include/select strategically
 */

// ❌ N+1 Query Problem
export async function getDoctorsWithTokensInefficient() {
    const doctors = await prisma.doctor.findMany();

    // This creates N additional queries (one per doctor)
    const doctorsWithTokens = await Promise.all(
        doctors.map(async (doctor) => ({
            ...doctor,
            tokens: await prisma.token.findMany({
                where: { doctorId: doctor.id },
            }),
        }))
    );

    return doctorsWithTokens;
}

// ✅ Solved with single query
export async function getDoctorsWithTokensOptimized() {
    return await prisma.doctor.findMany({
        include: {
            user: {
                select: { name: true, email: true },
            },
            tokens: {
                where: { status: TokenStatus.WAITING },
                select: {
                    tokenNumber: true,
                    patientName: true,
                    position: true,
                },
                orderBy: { joinedAt: 'asc' },
            },
        },
    });
}
