import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const availabilityTable = sqliteTable("availability", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  start_time: text("start_time").notNull(),
  time_in_minutes: integer("time_in_minutes").notNull(),
});

const bookingTable = sqliteTable("booking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenant_id: integer("tenant_id").notNull(),
  tenant_name: text("tenant_name").notNull(),
  availability_id: integer("availability_id").notNull(),
});

export { availabilityTable, bookingTable };