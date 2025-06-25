import { db } from "@/db";
import { availabilityTable, bookingTable } from "@/db/schema";
import { Availability } from "@/db/types";
import { notInArray } from "drizzle-orm";

export async function getFreeAvailability(): Promise<Availability[]> {
  // Get all availability IDs that have bookings
  const bookedAvailabilityIds = await db
    .select({ availability_id: bookingTable.availability_id })
    .from(bookingTable);
  
  const bookedIds = bookedAvailabilityIds.map(booking => booking.availability_id);
  
  // If no bookings exist, return all availability
  if (bookedIds.length === 0) {
    return await db.select().from(availabilityTable);
  }
  
  // Return all availability except those that have bookings
  const freeAvailability = await db
    .select()
    .from(availabilityTable)
    .where(notInArray(availabilityTable.id, bookedIds));
  
  return freeAvailability;
}
