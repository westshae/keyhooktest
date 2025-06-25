import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { availabilityTable, bookingTable } from "./schema";
import { z } from "zod";

// Availability types
export type Availability = InferSelectModel<typeof availabilityTable>;
export type NewAvailability = InferInsertModel<typeof availabilityTable>;

// Booking types
export type Booking = InferSelectModel<typeof bookingTable>;
export type NewBooking = InferInsertModel<typeof bookingTable>;

// Validation schemas
export const newAvailabilitySchema = z.object({
  date: z.string().describe("DD-MM-YYYY"),
  start_time: z.string().describe("HH:MM"),
  time_in_minutes: z.number().describe("30, 60, 90, 120 etc"),
});

export const bulkAvailabilitySchema = z.array(newAvailabilitySchema);
export const deleteIdsSchema = z.array(z.number());

// Tenant booking validation schemas
export const getTenantBookingsSchema = z.string().url().transform((url) => {
  const searchParams = new URL(url).searchParams;
  const tenantId = searchParams.get('tenantId');
  
  if (!tenantId) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: ['tenantId'],
        message: 'tenantId is required'
      }
    ]);
  }
  
  const tenantIdNumber = parseInt(tenantId, 10);
  if (isNaN(tenantIdNumber) || tenantIdNumber <= 0) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: ['tenantId'],
        message: 'tenantId must be a positive integer'
      }
    ]);
  }
  
  return { tenantId: tenantIdNumber };
});

export type GetTenantBookingsParams = z.infer<typeof getTenantBookingsSchema>;

// Create tenant booking validation schema
export const createTenantBookingSchema = z.object({
  tenant_id: z.number().positive().describe("Tenant ID must be a positive integer"),
  tenant_name: z.string().min(1).describe("Tenant name is required"),
  availability_id: z.number().positive().describe("Availability ID must be a positive integer"),
});

export type CreateTenantBookingParams = z.infer<typeof createTenantBookingSchema>;

// Delete tenant booking validation schema
export const deleteTenantBookingSchema = z.object({
  tenant_id: z.number().positive().describe("Tenant ID must be a positive integer"),
  booking_id: z.number().positive().describe("Booking ID must be a positive integer"),
});

export type DeleteTenantBookingParams = z.infer<typeof deleteTenantBookingSchema>;

// Delete PM booking validation schema
export const deletePmBookingSchema = z.object({
  booking_id: z.number().positive().describe("Booking ID must be a positive integer"),
});

export type DeletePmBookingParams = z.infer<typeof deletePmBookingSchema>;
