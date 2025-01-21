import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/utils/_errors/user-already-exists-error';
import { faker } from '@faker-js/faker';
import { compare } from 'bcrypt';
import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register.usecase';

const userFake = {
	name: faker.person.fullName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
};

describe('Registrar um usuario caso de uso', async () => {
	it('Verificar se o usuario foi criado', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);
		const { user } = await registerUseCase.execute({ ...userFake });

		expect(user.id).toEqual(expect.any(String));
	});
	it('Verificar se a senha foi criptografada', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);
		const { user } = await registerUseCase.execute({ ...userFake });

		if (user.password) {
			const isPasswordHashed = await compare(userFake.password, user.password);
			expect(isPasswordHashed).toBe(true);
		}
	});

	it('Não deve ser possivel registrar um usuario com caso o email ja existir', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		await registerUseCase.execute({ ...userFake });

		await expect(() =>
			registerUseCase.execute({ ...userFake }),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
