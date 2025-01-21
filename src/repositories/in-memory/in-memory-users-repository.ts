import { randomUUID } from 'node:crypto';
import type { Users, UsersCreateInput } from '@/db/schemas/users';
import type {
	UsersRepository,
	UsersRepositoryRequest,
	UsersRepositoryResponse,
} from '../users.repository';

export class InMemoryUsersRepository implements UsersRepository {
	public items: Users[] = [];

	async create(data: UsersRepositoryRequest) {
		const user: Users = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password: data.password || null,
			created_at: new Date(),
			updated_at: new Date(),
			email_verified: false,
			two_factor_authentication: false,
			provider: null,
			provider_user_id: null,
			role: 'MEMBER',
			product_id: null,
			image: null,
			active: true,
		};

		this.items.push(user);
		return user;
	}

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email === email);
		return user;
	}
	async findById(id: string) {
		const user = this.items.find((item) => item.id === id);
		return user;
	}
}
