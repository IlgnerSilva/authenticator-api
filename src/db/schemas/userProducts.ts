import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { usersTable } from "./users";
import { productsTable } from "./products";

export const userProductsTable = pgTable("user_products", {
	id: varchar({ length: 32 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	user_id: varchar({ length: 32 })
		.references(() => usersTable.id, { onDelete: "cascade" })
		.notNull(),
	product_id: varchar({ length: 32 })
		.references(() => productsTable.id, { onDelete: "cascade" })
		.notNull(),
	expired_at: timestamp("updated_at").notNull(),
	created_at: timestamp("created_at").defaultNow(),
});
