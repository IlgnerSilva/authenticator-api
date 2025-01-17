import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { hash } from "bcrypt";
import { RegisterUseCase } from "@/use-cases/user/register.usecase";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/_errors/user-already-exists-error";

const bodySchema = z.object({
	name: z.string(),
	email: z.string().email("Email is invalid."),
	password_hash: z.string().nonempty(),
});

export async function registerUserRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			"/register",
			{ schema: { tags: ["auth"], body: bodySchema } },
			async (request: FastifyRequest, replay: FastifyReply) => {
				const { email, password_hash, name } = bodySchema.parse(request.body);

				try {
					const usersRepository = new DrizzleUsersRepository();
					const registerUseCase = new RegisterUseCase(usersRepository);

					registerUseCase.execute({
						name,
						email,
						password_hash: await hash(password_hash, 6),
					});
				} catch (err) {
					if (err instanceof UserAlreadyExistsError) {
						return replay
							.status(409)
							.send({ error: true, message: err.message });
					}
					return replay.status(500).send();
				}
			},
		);
}
