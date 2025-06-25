import { db } from "@/db";
import { availabilityTable } from "@/db/schema";
import { Availability, NewAvailability } from "@/db/types";
import { inArray } from "drizzle-orm";

export const getAvailability = async () => {
  const availability:Availability[] = await db.select().from(availabilityTable);
  return availability;
};

export const postAvailability = async (availabilities: NewAvailability[]) => {
  const newAvailability = await db.insert(availabilityTable).values(availabilities);
  return newAvailability;
};

export const deleteAvailability = async (ids: number[]) => {
  const deletedAvailability = await db.delete(availabilityTable).where(inArray(availabilityTable.id, ids));
  return deletedAvailability;
};