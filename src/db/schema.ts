import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const availabilityTable = sqliteTable("availability", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  start_time: text("start_time").notNull(),
  slot_time_in_minutes: integer("slot_time_in_minutes").notNull(),
});

const bookingTable = sqliteTable("booking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenant_id: integer("tenant_id").notNull(),
  tenant_name: text("tenant_name").notNull(),
  slot_id: integer("slot_id").notNull(),
});

export { availabilityTable, bookingTable };