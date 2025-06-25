import { db } from "@/db";
import { availabilityTable } from "@/db/schema";
import { Availability, NewAvailability } from "@/db/types";
import { inArray, eq, and } from "drizzle-orm";

export const getAvailability = async () => {
  const availability:Availability[] = await db.select().from(availabilityTable);
  return availability;
};

export const postAvailability = async (availabilities: NewAvailability[]) => {
  const insertedRecords = [];
  
  for (const availability of availabilities) {
    // Force time_in_minutes to always be 30
    const fixedAvailability = { ...availability, time_in_minutes: 30 };
    // Check if a record with the same date, start_time, and time_in_minutes already exists
    const existingRecord = await db
      .select()
      .from(availabilityTable)
      .where(
        and(
          eq(availabilityTable.date, fixedAvailability.date),
          eq(availabilityTable.start_time, fixedAvailability.start_time),
          eq(availabilityTable.time_in_minutes, fixedAvailability.time_in_minutes)
        )
      )
      .limit(1);
    
    // Only insert if no duplicate exists
    if (existingRecord.length === 0) {
      const newRecord = await db.insert(availabilityTable).values(fixedAvailability);
      insertedRecords.push(newRecord);
    }
  }
  
  return insertedRecords;
};

export const deleteAvailability = async (ids: number[]) => {
  const deletedAvailability = await db.delete(availabilityTable).where(inArray(availabilityTable.id, ids));
  return deletedAvailability;
};