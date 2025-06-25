import { db } from '@/db';
import { bookingTable, availabilityTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Booking, Availability } from '@/db/types';

// Extended type for bookings with availability data
export interface BookingWithAvailability extends Booking {
  availability: Availability;
}

export async function getAllBookings(): Promise<BookingWithAvailability[]> {
  const bookings = await db
    .select({
      id: bookingTable.id,
      tenant_id: bookingTable.tenant_id,
      tenant_name: bookingTable.tenant_name,
      availability_id: bookingTable.availability_id,
      availability: {
        id: availabilityTable.id,
        date: availabilityTable.date,
        start_time: availabilityTable.start_time,
        time_in_minutes: availabilityTable.time_in_minutes,
      }
    })
    .from(bookingTable)
    .innerJoin(availabilityTable, eq(bookingTable.availability_id, availabilityTable.id));
  
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
