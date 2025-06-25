import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, deletePmBooking } from './service';
import { deletePmBookingSchema } from '@/db/types';

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ data: bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const params = deletePmBookingSchema.parse(body);
    const result = await deletePmBooking(params.booking_id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body. Please provide booking_id' },
        { status: 400 }
      );
    }
    
    console.error('Error deleting PM booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 