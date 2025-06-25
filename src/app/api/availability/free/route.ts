import { NextResponse } from 'next/server';
import { getFreeAvailability } from './service';

export async function GET() {
  try {
    const freeAvailability = await getFreeAvailability();
    return NextResponse.json({ data: freeAvailability });
  } catch (error) {
    console.error('Error fetching free availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch free availability' },
      { status: 500 }
    );
  }
}