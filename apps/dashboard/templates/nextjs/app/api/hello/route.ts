import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Webduh Next.js API!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: [
      'API Routes',
      'Server-side Rendering',
      'TypeScript Support',
      'Tailwind CSS',
      'Fast Refresh',
    ],
    stats: {
      uptime: process.uptime(),
      nodeVersion: process.version,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      message: 'Data received successfully',
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 },
    );
  }
}
