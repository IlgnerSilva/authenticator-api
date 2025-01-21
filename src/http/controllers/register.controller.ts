import { DrizzleUsersRepository } from '@/repositories/drizzle/drizzle-users-repository';
import { RegisterUseCase } from '@/usecases/user/register.usecase';
import { RouterError } from '@/utils/_errors/router-errors';
import { UserAlreadyExistsError } from '@/utils/_errors/user-already-exists-error';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const bodySchema = z.object({
	name: z.string().nonempty("Name can't be empty."),
	email: z.string().email('Email is invalid.'),
	password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export async function registerUserRoute(app: FastifyInstance) {
	app.after(() => {
		app.withTypeProvider<ZodTypeProvider>().route({
			method: 'POST',
			url: '/register',
			schema: {
				body: bodySchema,
			},
			handler: async (request: FastifyRequest, replay: FastifyReply) => {
				const { email, password, name } = bodySchema.parse(request.body);

				try {
					const usersRepository = new DrizzleUsersRepository();
					const registerUseCase = new RegisterUseCase(usersRepository);
					await registerUseCase.execute({
						name,
						email,
						password,
					});

					return replay.status(201).send();
				} catch (err) {
					if (err instanceof UserAlreadyExistsError)
						return replay
							.status(409)
							.send({ error: true, message: err.message });

					return replay
						.status(500)
						.send({ error: true, message: 'Internal server error.' });
				}
			},
			errorHandler(error, request, reply) {
				new RouterError(error, reply).handle();
			},
		});
	});
}
