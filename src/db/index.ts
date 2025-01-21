import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as productsTable from './schemas/products';
import * as userProductsTable from './schemas/user-products';
import * as usersTable from './schemas/users';

export const db = drizzle({
	connection: env.DATABASE_URL,
	logger: env.NODE_ENV === 'dev',
	schema: { ...productsTable, ...userProductsTable, ...usersTable },
});
