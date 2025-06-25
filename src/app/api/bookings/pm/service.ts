import { db } from '@/db';
import { bookingTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Booking } from '@/db/types';

export async function getAllBookings(): Promise<Booking[]> {
  const bookings = await db
    .select()
    .from(bookingTable);
  
  return bookings;
}

export async function deletePmBooking(bookingId: number): Promise<Booking | null> {
  // First check if the booking exists
  const existingBooking = await db
    .select()
    .from(bookingTable)
    .where(eq(bookingTable.id, bookingId))
    .limit(1);
  
  if (existingBooking.length === 0) {
    return null;
  }
  
  // Delete the booking
  const [deletedBooking] = await db
    .delete(bookingTable)
    .where(eq(bookingTable.id, bookingId))
    .returning();
  
  return deletedBooking;
}
