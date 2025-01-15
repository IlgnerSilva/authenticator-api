import {
	text,
	pgTable,
	varchar,
	boolean,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { productsTable } from "./products";

export const roleEnum = pgEnum("role", ["ROOT", "ADMIN", "MEMBER"]);

export const usersTable = pgTable("users", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	email: varchar({ length: 255 }).notNull().unique(),
	password_hash: varchar({ length: 32 }),
	email_verified: boolean().default(false),
	two_factor_authentication: boolean().default(false),
	provider: varchar("provider", { length: 15 }),
	provider_user_id: varchar("provider_user_id", { length: 255 }),
	role: roleEnum(),
	product_id: varchar({ length: 32 }).references(() => productsTable.id, {
		onDelete: "cascade",
	}),
	image: text(),
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
	active: boolean().default(true),
});
