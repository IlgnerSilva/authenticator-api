import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const productsTable = pgTable("products", {
	id: varchar({ length: 32 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	name: varchar({ length: 10 }).notNull(),
	description: varchar({ length: 100 }),
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});
