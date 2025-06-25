import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { availabilityTable, bookingTable } from "./schema";

// Slot types
export type Availability = InferSelectModel<typeof availabilityTable>;
export type NewAvailability = InferInsertModel<typeof availabilityTable>;

// Booking types
export type Booking = InferSelectModel<typeof bookingTable>;
export type NewBooking = InferInsertModel<typeof bookingTable>;
