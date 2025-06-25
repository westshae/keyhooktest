import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { availabilityTable, bookingTable } from "./schema";
import { z } from "zod";

// Slot types
export type Availability = InferSelectModel<typeof availabilityTable>;
export type NewAvailability = InferInsertModel<typeof availabilityTable>;

// Booking types
export type Booking = InferSelectModel<typeof bookingTable>;
export type NewBooking = InferInsertModel<typeof bookingTable>;

// Validation schemas
export const newAvailabilitySchema = z.object({
  date: z.string().describe("DD-MM-YYYY"),
  start_time: z.string().describe("HH:MM"),
  slot_time_in_minutes: z.number().describe("30, 60, 90, 120 etc"),
});

export const bulkAvailabilitySchema = z.array(newAvailabilitySchema);
export const deleteIdsSchema = z.array(z.number());
