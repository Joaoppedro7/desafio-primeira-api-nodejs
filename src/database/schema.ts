import { desc } from "drizzle-orm";
import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { title } from "process";
import { isDataView } from "util/types";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const courses = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull().unique(),
  description: text(),
});
