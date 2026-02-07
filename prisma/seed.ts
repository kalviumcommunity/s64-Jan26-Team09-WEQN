import { PrismaClient, Role, TokenStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data for idempotency
    await prisma.consultation.deleteMany();
    await prisma.token.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Hash password for all users (same password for testing: password123)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const admin = await prisma.user.create({
        data: {
            email: 'admin@hospital.com',
            passwordHash: hashedPassword,
            name: 'Admin User',
            phone: '+919876543210',
            role: Role.ADMIN,
        },
    });

    const doctorUser1 = await prisma.user.create({
        data: {
            email: 'dr.sharma@hospital.com',
            passwordHash: hashedPassword,
            name: 'Dr. Rajesh Sharma',
            phone: '+919876543211',
            role: Role.DOCTOR,
        },
    });

    const doctorUser2 = await prisma.user.create({
        data: {
            email: 'dr.patel@hospital.com',
            passwordHash: hashedPassword,
            name: 'Dr. Priya Patel',
            phone: '+919876543212',
            role: Role.DOCTOR,
        },
    });

    const patient1 = await prisma.user.create({
        data: {
            email: 'patient1@example.com',
            passwordHash: hashedPassword,
            name: 'Amit Kumar',
            phone: '+919876543213',
            role: Role.PATIENT,
        },
    });

    const patient2 = await prisma.user.create({
        data: {
            email: 'patient2@example.com',
            passwordHash: hashedPassword,
            name: 'Priya Singh',
            phone: '+919876543214',
            role: Role.PATIENT,
        },
    });

    const patient3 = await prisma.user.create({
        data: {
            email: 'patient3@example.com',
            passwordHash: hashedPassword,
            name: 'Rahul Verma',
            phone: '+919876543215',
            role: Role.PATIENT,
        },
    });

    console.log('✅ Created 6 users (1 admin, 2 doctors, 3 patients)');

    // 2. Create Doctor Profiles
    const drSharma = await prisma.doctor.create({
        data: {
            userId: doctorUser1.id,
            department: 'Cardiology',
            specialization: 'Heart Surgery',
            roomNumber: 'C-101',
            avgConsultationMinutes: 15,
            isAvailable: true,
        },
    });

    const drPatel = await prisma.doctor.create({
        data: {
            userId: doctorUser2.id,
            department: 'Pediatrics',
            specialization: 'Child Health',
            roomNumber: 'P-205',
            avgConsultationMinutes: 10,
            isAvailable: true,
        },
    });

    console.log('✅ Created 2 doctor profiles');

    // 3. Create Tokens (Queue Entries)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const token1 = await prisma.token.create({
        data: {
            tokenNumber: 'C-001',
            patientId: patient1.id,
            patientName: patient1.name,
            patientPhone: patient1.phone!,
            doctorId: drSharma.id,
            status: TokenStatus.COMPLETED,
            position: null,
            joinedAt: twoHoursAgo,
            calledAt: new Date(twoHoursAgo.getTime() + 10 * 60 * 1000),
            completedAt: new Date(twoHoursAgo.getTime() + 25 * 60 * 1000),
            estimatedWaitMinutes: 0,
        },
    });

    const token2 = await prisma.token.create({
        data: {
            tokenNumber: 'P-001',
            patientId: patient2.id,
            patientName: patient2.name,
            patientPhone: patient2.phone!,
            doctorId: drPatel.id,
            status: TokenStatus.COMPLETED,
            position: null,
            joinedAt: oneHourAgo,
            calledAt: new Date(oneHourAgo.getTime() + 5 * 60 * 1000),
            completedAt: new Date(oneHourAgo.getTime() + 18 * 60 * 1000),
            estimatedWaitMinutes: 0,
        },
    });

    await prisma.token.create({
        data: {
            tokenNumber: 'C-002',
            patientId: patient3.id,
            patientName: patient3.name,
            patientPhone: patient3.phone!,
            doctorId: drSharma.id,
            status: TokenStatus.IN_PROGRESS,
            position: null,
            joinedAt: new Date(now.getTime() - 15 * 60 * 1000),
            calledAt: now,
            estimatedWaitMinutes: 0,
        },
    });

    await prisma.token.create({
        data: {
            tokenNumber: 'C-003',
            patientName: 'Walk-in Patient 1',
            patientPhone: '+919876543220',
            doctorId: drSharma.id,
            status: TokenStatus.WAITING,
            position: 1,
            joinedAt: new Date(now.getTime() - 5 * 60 * 1000),
            estimatedWaitMinutes: 15,
        },
    });

    await prisma.token.create({
        data: {
            tokenNumber: 'P-002',
            patientName: 'Walk-in Patient 2',
            patientPhone: '+919876543221',
            doctorId: drPatel.id,
            status: TokenStatus.WAITING,
            position: 1,
            joinedAt: now,
            estimatedWaitMinutes: 10,
        },
    });

    console.log('✅ Created 5 tokens');

    // 4. Create Consultations (for completed tokens)
    await prisma.consultation.create({
        data: {
            tokenId: token1.id,
            doctorId: drSharma.id,
            patientId: patient1.id,
            startTime: token1.calledAt!,
            endTime: token1.completedAt!,
            durationMinutes: 15,
            notes: 'Regular checkup completed. Blood pressure normal.',
        },
    });

    await prisma.consultation.create({
        data: {
            tokenId: token2.id,
            doctorId: drPatel.id,
            patientId: patient2.id,
            startTime: token2.calledAt!,
            endTime: token2.completedAt!,
            durationMinutes: 13,
            notes: 'Vaccination administered. Next checkup in 3 months.',
        },
    });

    console.log('✅ Created 2 consultations');

    // Summary
    const counts = {
        users: await prisma.user.count(),
        doctors: await prisma.doctor.count(),
        tokens: await prisma.token.count(),
        consultations: await prisma.consultation.count(),
    };

    console.log('\n📊 Database seeded successfully!');
    console.log('   - Users: ' + counts.users);
    console.log('   - Doctors: ' + counts.doctors);
    console.log('   - Tokens: ' + counts.tokens);
    console.log('   - Consultations: ' + counts.consultations);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
