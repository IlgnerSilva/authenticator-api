import type {
	UsersRepository,
	UsersRepositoryRequest,
} from "@/repositories/users.repository";
import { UserAlreadyExistsError } from "../_errors/user-already-exists-error";

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}
	async execute({ name, email, password_hash }: UsersRepositoryRequest) {
		const userExists = await this.usersRepository.findByEmail(email);

		if (userExists) throw new UserAlreadyExistsError();

		await this.usersRepository.create({ name, email, password_hash });
	}
}
