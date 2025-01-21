import { randomUUID } from 'node:crypto';
import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from 'drizzle-zod';
import { productsTable } from './products';

type OptionalFields<T> = {
	[K in keyof T]: null | undefined extends T[K] ? T[K] | undefined : T[K];
};

const roleEnum = pgEnum('role_enum', ['ROOT', 'ADMIN', 'MEMBER']);
export const usersTable = pgTable('users', {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }),
	email_verified: boolean().default(false),
	two_factor_authentication: boolean().default(false),
	provider: varchar('provider', { length: 15 }),
	provider_user_id: varchar('provider_user_id', { length: 255 }),
	role: roleEnum(),
	product_id: varchar({ length: 32 }).references(() => productsTable.id, {
		onDelete: 'cascade',
	}),
	image: text(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').$onUpdate(() => new Date()),
	active: boolean().default(true),
});

export type Users = typeof usersTable.$inferSelect;
export type UsersCreateInput = OptionalFields<typeof usersTable.$inferInsert>;

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable, {
	password: (schema) => schema.optional(),
});
export const userUpdateSchema = createUpdateSchema(usersTable);
