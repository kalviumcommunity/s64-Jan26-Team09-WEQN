import { prisma } from './prisma';

/**
 * Test database connection
 * This function attempts to connect to the database and fetch basic info
 */
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection with a simple query
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
    
    // Get database metadata
    const result = await prisma.$queryRaw`SELECT version()` as Array<{ version: string }>;
    console.log('📊 Database version:', result[0]?.version || 'Unknown');
    
    // Count existing records (will be 0 initially)
    const userCount = await prisma.user.count();
    const doctorCount = await prisma.doctor.count();
    const tokenCount = await prisma.token.count();
    
    console.log('📈 Current database state:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Doctors: ${doctorCount}`);
    console.log(`   - Tokens: ${tokenCount}`);
    
    return { success: true, userCount, doctorCount, tokenCount };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((result) => {
      if (result.success) {
        console.log('\n✨ Database connection test passed!');
        process.exit(0);
      } else {
        console.error('\n💥 Database connection test failed!');
        process.exit(1);
      }
    });
}
