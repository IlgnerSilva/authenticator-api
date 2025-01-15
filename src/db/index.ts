import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";

export const db = drizzle({
	connection: env.NODE_ENV,
	logger: env.NODE_ENV === "dev",
});
