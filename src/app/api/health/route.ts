import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns the health status of the API
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Digital Queue Management System',
      version: '1.0.0',
    },
    { status: 200 }
  );
}
