import { prisma } from '../db/prisma';
import { getTokensInefficient, getTokensOptimized } from '../queries/optimized';

/**
 * Benchmark query performance before and after optimization
 */
export async function benchmarkQueries() {
    console.log('🔍 Running performance benchmarks...\n');

    // Get a doctor ID from seed data
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) {
        console.log('No doctor found. Run seed first.');
        return;
    }

    // Benchmark 1: Field selection
    console.log('Benchmark 1: Field Selection');
    console.log('----------------------------');

    const start1 = Date.now();
    const inefficient = await getTokensInefficient(doctor.id);
    const time1 = Date.now() - start1;
    console.log(`❌ Inefficient (all fields): ${time1}ms - ${inefficient.length} records`);

    const start2 = Date.now();
    const optimized = await getTokensOptimized(doctor.id);
    const time2 = Date.now() - start2;
    console.log(`✅ Optimized (select fields): ${time2}ms - ${optimized.length} records`);
    console.log(`Improvement: ${((time1 - time2) / time1 * 100).toFixed(1)}% faster\n`);

    // Benchmark 2: Index usage (requires migration)
    console.log('Benchmark 2: Index Usage');
    console.log('------------------------');

    const start3 = Date.now();
    await prisma.token.findMany({
        where: { status: 'WAITING' },
    });
    const time3 = Date.now() - start3;
    console.log(`Query with index on status: ${time3}ms\n`);

    console.log('✅ Benchmarks complete!');
}

/**
 * Run all benchmarks
 */
if (require.main === module) {
    benchmarkQueries()
        .then(() => prisma.$disconnect())
        .catch((e) => {
            console.error(e);
            prisma.$disconnect();
            process.exit(1);
        });
}
