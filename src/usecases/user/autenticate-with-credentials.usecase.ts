import type { UsersRepository } from '@/repositories/users.repository';
import { UserCredentialsInvalidError } from '@/utils/_errors/user-credentials-invalid-error';
import { compare } from 'bcrypt';

interface AutenticateUseCaseRequest {
	email: string;
	password: string;
	code_2fa?: string;
}

export class AuthenticateWithCredentialsUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ email, password, code_2fa }: AutenticateUseCaseRequest) {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) throw new UserCredentialsInvalidError();

		if (user.password) {
			const isPasswordCorrect = await compare(password, user.password);
			if (!isPasswordCorrect) throw new UserCredentialsInvalidError();
		}
	}
}
