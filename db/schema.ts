import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const safetyAdvisories = pgTable("safety_advisories", {
  id: serial().primaryKey(),
  message: text().notNull(),
  severity: text().notNull(),
  time: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
