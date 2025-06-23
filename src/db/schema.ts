import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const contactTable = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
});

export { contactTable };