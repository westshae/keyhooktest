import { NextRequest, NextResponse } from 'next/server';
import { createTenantBooking, deleteTenantBooking, getFreeAvailability } from './service';
import { createTenantBookingSchema, deleteTenantBookingSchema } from '@/db/types';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params = createTenantBookingSchema.parse(body);
    const result = await createTenantBooking(params);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body. Please provide tenant_id, tenant_name, and availability_id' },
        { status: 400 }
      );
    }
    
    console.error('Error creating tenant booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const params = deleteTenantBookingSchema.parse(body);
    const result = await deleteTenantBooking(params.tenant_id, params.booking_id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body. Please provide tenant_id and booking_id' },
        { status: 400 }
      );
    }
    
    console.error('Error deleting tenant booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 