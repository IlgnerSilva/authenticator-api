import type {
	UsersRepository,
	UsersRepositoryRequest,
	UsersRepositoryResponse,
} from '@/repositories/users.repository';
import { hash } from 'bcrypt';
import { UserAlreadyExistsError } from '../../utils/_errors/user-already-exists-error';

interface RegisterUseCaseResponse {
	user: UsersRepositoryResponse;
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}
	async execute(
		data: UsersRepositoryRequest,
	): Promise<RegisterUseCaseResponse> {
		const userExists = await this.usersRepository.findByEmail(data.email);

		if (userExists) throw new UserAlreadyExistsError();

		if (data.password) data.password = await hash(data.password, 6);

		await this.usersRepository.create(data);

		const user = await this.usersRepository.findByEmail(data.email);
		if (!user) throw new Error('User not created.');
		return { user };
	}
}
