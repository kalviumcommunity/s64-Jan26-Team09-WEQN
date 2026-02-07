import { prisma } from './prisma';
import { TokenStatus } from '@prisma/client';

/**
 * Transaction 1: Join Queue
 * Atomically creates a token and updates queue metadata
 */
export async function joinQueueTransaction(data: {
    patientName: string;
    patientPhone: string;
    patientId?: string;
    doctorId: string;
}) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get current queue count for doctor
            const waitingTokens = await tx.token.count({
                where: {
                    doctorId: data.doctorId,
                    status: { in: [TokenStatus.WAITING, TokenStatus.CALLED] },
                },
            });

            // 2. Get doctor's average consultation time
            const doctor = await tx.doctor.findUnique({
                where: { id: data.doctorId },
                select: { avgConsultationMinutes: true, department: true },
            });

            if (!doctor) {
                throw new Error('Doctor not found');
            }

            // 3. Generate token number
            const tokenNumber = `${doctor.department.charAt(0)}-${String(waitingTokens + 1).padStart(3, '0')}`;

            // 4. Create token
            const token = await tx.token.create({
                data: {
                    tokenNumber,
                    patientName: data.patientName,
                    patientPhone: data.patientPhone,
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    status: TokenStatus.WAITING,
                    position: waitingTokens + 1,
                    estimatedWaitMinutes: waitingTokens * doctor.avgConsultationMinutes,
                },
            });

            console.log(`✅ Token ${token.tokenNumber} created. Position: ${token.position}`);
            return token;
        });

        return { success: true, token: result };
    } catch (error) {
        console.error('❌ Join queue transaction failed:', error);
        return { success: false, error };
    }
}

/**
 * Transaction 2: Call Next Patient
 * Atomically updates token status and adjusts queue positions
 */
export async function callNextPatientTransaction(doctorId: string) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Find next waiting token
            const nextToken = await tx.token.findFirst({
                where: {
                    doctorId,
                    status: TokenStatus.WAITING,
                },
                orderBy: { joinedAt: 'asc' },
            });

            if (!nextToken) {
                throw new Error('No patients waiting in queue');
            }

            // 2. Update token status to CALLED
            const calledToken = await tx.token.update({
                where: { id: nextToken.id },
                data: {
                    status: TokenStatus.CALLED,
                    calledAt: new Date(),
                },
            });

            // 3. Update positions for remaining waiting tokens
            await tx.token.updateMany({
                where: {
                    doctorId,
                    status: TokenStatus.WAITING,
                    joinedAt: { gt: nextToken.joinedAt },
                },
                data: {
                    position: { decrement: 1 },
                },
            });

            console.log(`✅ Called token ${calledToken.tokenNumber}`);
            return calledToken;
        });

        return { success: true, token: result };
    } catch (error) {
        console.error('❌ Call next patient transaction failed:', error);
        return { success: false, error };
    }
}

/**
 * Transaction 3: Complete Consultation
 * Atomically updates token, creates consultation record, and updates doctor
 */
export async function completeConsultationTransaction(
    tokenId: string,
    notes?: string
) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get token details
            const token = await tx.token.findUnique({
                where: { id: tokenId },
            });

            if (!token || token.status !== TokenStatus.CALLED) {
                throw new Error('Token not found or not in CALLED state');
            }

            // 2. Calculate duration
            const startTime = token.calledAt!;
            const endTime = new Date();
            const durationMinutes = Math.round(
                (endTime.getTime() - startTime.getTime()) / 60000
            );

            // 3. Update token to COMPLETED
            const completedToken = await tx.token.update({
                where: { id: tokenId },
                data: {
                    status: TokenStatus.COMPLETED,
                    completedAt: endTime,
                },
            });

            // 4. Create consultation record
            const consultation = await tx.consultation.create({
                data: {
                    tokenId: token.id,
                    doctorId: token.doctorId,
                    patientId: token.patientId,
                    startTime,
                    endTime,
                    durationMinutes,
                    notes: notes || 'Consultation completed successfully.',
                },
            });

            // 5. Update doctor's average consultation time
            const avgConsultation = await tx.consultation.aggregate({
                where: {
                    doctorId: token.doctorId,
                    durationMinutes: { not: null },
                },
                _avg: { durationMinutes: true },
            });

            if (avgConsultation._avg.durationMinutes) {
                await tx.doctor.update({
                    where: { id: token.doctorId },
                    data: {
                        avgConsultationMinutes: Math.round(avgConsultation._avg.durationMinutes),
                    },
                });
            }

            console.log(`✅ Consultation completed. Duration: ${durationMinutes} minutes`);
            return { token: completedToken, consultation };
        });

        return { success: true, data: result };
    } catch (error) {
        console.error('❌ Complete consultation transaction failed:', error);
        return { success: false, error };
    }
}

/**
 * Transaction 4: Rollback Example
 * Demonstrates transaction rollback on error
 */
export async function demonstrateRollback() {
    try {
        await prisma.$transaction(async (tx) => {
            // This will succeed
            const user = await tx.user.create({
                data: {
                    email: 'rollback-test@example.com',
                    passwordHash: 'test',
                    name: 'Rollback Test',
                    role: 'PATIENT',
                },
            });

            console.log('Created user:', user.id);

            // This will fail intentionally
            await tx.user.create({
                data: {
                    email: 'rollback-test@example.com', // Duplicate email!
                    passwordHash: 'test',
                    name: 'Duplicate',
                    role: 'PATIENT',
                },
            });
        });
    } catch (error) {
        console.log('✅ Transaction rolled back successfully!');
        console.log('Error:', error instanceof Error ? error.message : 'Unknown error');

        // Verify rollback
        const user = await prisma.user.findUnique({
            where: { email: 'rollback-test@example.com' },
        });

        console.log('User exists after rollback?', user !== null);
        return { rolledBack: true };
    }
}
