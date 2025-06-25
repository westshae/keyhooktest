import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { slotTable, bookingTable } from "./schema";

// Slot types
export type Slot = InferSelectModel<typeof slotTable>;
export type NewSlot = InferInsertModel<typeof slotTable>;

// Booking types
export type Booking = InferSelectModel<typeof bookingTable>;
export type NewBooking = InferInsertModel<typeof bookingTable>;
