// app/api/test-connection/route.ts

import { NextResponse } from 'next/server';
import { initializeDataSource } from 'lib/db';

export async function GET() {
  try {
    await initializeDataSource();
    return NextResponse.json({ message: 'Database connection successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
