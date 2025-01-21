import { randomUUID } from 'node:crypto';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const productsTable = pgTable('products', {
	id: varchar({ length: 32 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	user_id: varchar({ length: 32 })
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	code: varchar({ length: 6 }).notNull(),
	expires_at: timestamp()
		.notNull()
		.$defaultFn(() => new Date(Date.now() + 5 * 60 * 1000)),
	daily_limit: integer()
		.notNull()
		.$defaultFn(() => 5),
	limitExpires_at: timestamp()
		.notNull()
		.$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').$onUpdate(() => new Date()),
});
