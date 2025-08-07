import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'OK',
      message: 'zcreens API is working correctly',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        upload: '/api/upload',
        presentation: '/api/presentation/[code]',
        test: '/api/test'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      status: 'OK',
      message: 'POST endpoint working',
      received: 'POST request to test endpoint'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'POST test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
