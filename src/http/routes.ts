import type { FastifyInstance } from "fastify";
import { registerUserRoute } from "@/http/controllers/register.controller";

export async function appRoutes(app: FastifyInstance) {
	app.register(registerUserRoute);
}
