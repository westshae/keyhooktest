import { db } from '@/db';
import { bookingTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Booking, CreateTenantBookingParams } from '@/db/types';

export async function getTenantBookings(tenantId: number): Promise<Booking[]> {
  const bookings = await db
    .select()
    .from(bookingTable)
    .where(eq(bookingTable.tenant_id, tenantId));
  
  return bookings;
}

export async function createTenantBooking(params: CreateTenantBookingParams): Promise<Booking> {
  const [booking] = await db
    .insert(bookingTable)
    .values({
      tenant_id: params.tenant_id,
      tenant_name: params.tenant_name,
      availability_id: params.availability_id,
    })
    .returning();
  
  return booking;
}

export async function deleteTenantBooking(tenantId: number, bookingId: number): Promise<Booking | null> {
  // First check if the booking exists and belongs to the tenant
  const existingBooking = await db
    .select()
    .from(bookingTable)
    .where(eq(bookingTable.id, bookingId))
    .limit(1);
  
  if (existingBooking.length === 0) {
    return null;
  }
  
  const booking = existingBooking[0];
  
  // Verify the booking belongs to the specified tenant
  if (booking.tenant_id !== tenantId) {
    return null;
  }
  
  // Delete the booking
  const [deletedBooking] = await db
    .delete(bookingTable)
    .where(eq(bookingTable.id, bookingId))
    .returning();
  
  return deletedBooking;
}
