import { integer, pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ['Free', 'paid']);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  plan: planEnum("plan").default('Free'),
  eventsCreated: integer().default(0),
  eventsAttended: integer().default(0)
});

export const event = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  location: varchar({ length: 255 }).notNull(),
  posterUrl: varchar({ length: 255 }).notNull(),
  date: integer().notNull(),
  startTime: integer().notNull(),
  duration: integer().notNull(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" })
})

export const attendee = pgTable("attendee", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  eventId: integer().notNull().references(() => event.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" })
})